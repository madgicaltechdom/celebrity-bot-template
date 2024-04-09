import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';

import { LocalizationService } from '../localization/localization.service';
import { localisedStrings } from 'src/i18n/en/localised-strings';

@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;
  

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
  }
  

  public async processMessage(body: any): Promise<any> {
    try {
      const { from, text, button_response, persistent_menu_response } = body;
      console.log(button_response)
      
      let botID = process.env.BOT_ID;
      let UserData = await this.userService.findUserByMobileNumber(from);
      

      if (!(UserData)){
        await this.userService.createUser(from,botID);
       
      }
      const userData = await this.userService.findUserByMobileNumber(from);
      const localisedStrings = await LocalizationService.getLocalisedString(
        userData.language,
      );
      
      console.log(localisedStrings.category_list)
      

      if (!persistent_menu_response && !(button_response) && localisedStrings.greetings.includes(text.body.toLowerCase())) {
        this.message.sendWelcomeMessage(from, userData.language);
       
        this.message.buttonoptions(from,userData.language);
       
      } else if (button_response && (localisedStrings.category_list.includes(button_response.body))) {

       
        switch(button_response.body) {
          case 'About the Celebrity':
            
            
            this.message.sendAboutCelebrityMessage(from, userData.language);
            this.message.goBackToMainMenu(from, userData.language);
            break;
          case 'Latest News and Projects':
            
            
            this.message.sendLatestNewsMessage(from, userData.language);
            this.message.Followupbuttons(from, userData.language);
            break;
          case 'Social Media Links':
            
            
            this.message.sendSocialmediaMessage(from, userData.language);
            this.message.goBackToMainMenu(from, userData.language);
            break;
          case 'Ask a question':
            
           
            this.message.sendAskQuestionMessage(from, userData.language);
            this.message.Followupbuttons(from, userData.language);
            break;
          case 'Report a Problem':
          
            
            this.message.sendReportProblemMessage(from, userData.language);
            this.message.goBackToMainMenu(from, userData.language);
            break;
        }
      }
      else if (persistent_menu_response) {
        await this.message.languageButtons(from, userData.language);
      } else if (
        button_response &&
        localisedStrings.languageButtons.includes(button_response.body)
      ) {
        await this.userService.saveLanguage(from, botID, button_response.body);
        await this.message.buttonoptions(from, button_response.body);
      }
      
      else if (
        button_response &&
        localisedStrings.back_to_main_menu.includes(button_response.body)
      ) {
          this.message.buttonoptions(from, userData.language);
        } 
      else if(button_response && localisedStrings.morebuttons.includes(button_response.body)){
        console.log("followup")
          if(button_response.body === localisedStrings.morebuttons[0]){
            this.message.buttonoptions(from, userData.language);
          }else if(button_response.body === localisedStrings.morebuttons[1]){
            await this.message.sendAskQuestionMessage(from, userData.language);
          }
        }
      else{
        console.log("Response not provided")
      }
     
      return 'ok';
    } catch (error) {
      console.error('Error processing message:', error);
      throw error; 
  }
}
}