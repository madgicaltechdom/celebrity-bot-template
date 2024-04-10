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
  private readonly botId=process.env.Bot_id;

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
      

      let botID = process.env.BOT_ID;
      let UserData = await this.userService.findUserByMobileNumber(from);
      console.log("Userdata", UserData)

      if (!UserData) {
        console.log("hello")
        await this.userService.createUser(from, botID);
      }
      const userData = await this.userService.findUserByMobileNumber(from);
      console.log("New user data",userData)
      const localisedStrings = await LocalizationService.getLocalisedString(
        userData.language,
      );


      if (
        !persistent_menu_response &&
        !button_response &&
        localisedStrings.greetings.includes(text.body.toLowerCase())
      ) {
        this.message.sendWelcomeMessage(from, userData.language);

        this.message.buttonoptions(from, userData.language);
      } else if (
        button_response &&
        localisedStrings.category_list.includes(button_response.body)) {
        if(button_response.body=== localisedStrings.category_list[0]){
          this.message.sendAboutCelebrityMessage(from, userData.language);
            this.message.goBackToMainMenu(from, userData.language);
        } else if(button_response.body=== localisedStrings.category_list[1]){
          this.message.sendLatestNewsMessage(from, userData.language);
            this.message.Followupbuttons(from, userData.language);
        }
        else if(button_response.body=== localisedStrings.category_list[2]){
          this.message.sendSocialmediaMessage(from, userData.language);
          this.message.goBackToMainMenu(from, userData.language);
        } else if(button_response.body === localisedStrings.category_list[3]){
          this.message.sendAskQuestionMessage(from, userData.language);

            this.message.Followupbuttons(from, userData.language);
        } else if(button_response.body === localisedStrings.category_list[4]){
          this.message.sendReportProblemMessage(from, userData.language);
            this.message.goBackToMainMenu(from, userData.language);
        }
      } else if (persistent_menu_response) {
        await this.message.languageButtons(from, userData.language);
      } else if (
        button_response &&
        localisedStrings.languageButtons.includes(button_response.body)
      ) {
        let language= await this.userService.saveLanguage(from, botID, button_response.body);
        console.log("language changed:",language)
        await this.message.buttonoptions(from, language.language);
      } 
      else if (
        button_response &&
        localisedStrings.back_to_main_menu.includes(button_response.body)
      ) {
        this.message.buttonoptions(from, userData.language);
      } else if (
        button_response &&
        localisedStrings.morebuttons.includes(button_response.body)
      ) {
        
        if (button_response.body === localisedStrings.morebuttons[0]) {
          this.message.buttonoptions(from, userData.language);
        } else if (button_response.body === localisedStrings.morebuttons[1]) {
          await this.message.sendAskQuestionMessage(from, userData.language);
        }
      } else {
        console.log('Response not provided');
      }

      return 'ok';
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}
