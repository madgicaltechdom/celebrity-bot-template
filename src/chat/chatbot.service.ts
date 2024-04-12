import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from '../message/message.service';
import { UserService } from '../model/user.service';

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
      

      if (!UserData) {
        await this.userService.createUser(from, botID);
      }
      const userData = await this.userService.findUserByMobileNumber(from);
      const localisedStrings = await LocalizationService.getLocalisedString(
        userData.language,
      );


      if (
        !persistent_menu_response &&
        !button_response &&
        localisedStrings.greetings.includes(text.body.toLowerCase())
      ) {
        await this.message.sendWelcomeMessage(from, userData.language);

        await this.message.buttonoptions(from, userData.language);
      } else if (
        button_response &&
        localisedStrings.category_list.includes(button_response.body)) {
        if(button_response.body=== localisedStrings.category_list[0]){
          await this.message.sendAboutCelebrityMessage(from, userData.language);
            await this.message.goBackToMainMenu(from, userData.language);
            await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[0])
        } else if(button_response.body=== localisedStrings.category_list[1]){
          await this.message.sendLatestNewsMessage(from, userData.language);
            await this.message.Followupbuttons(from, userData.language);
            await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[1])
        }
        else if(button_response.body=== localisedStrings.category_list[2]){
          await this.message.sendSocialmediaMessage(from, userData.language);
          await this.message.goBackToMainMenu(from, userData.language);
          await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[2])
        } else if(button_response.body === localisedStrings.category_list[3]){
          await this.message.sendAskQuestionMessage(from, userData.language);
          await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[3])

        } else if(button_response.body === localisedStrings.category_list[4]){
          await this.message.sendReportProblemMessage(from, userData.language);
            await this.message.goBackToMainMenu(from, userData.language);
            await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[4])
        }
      } 

      else if(!persistent_menu_response && !button_response && userData.buttonResponse===localisedStrings.category_list[3]){
        await this.userService.updateUsercontext(from,userData.language, body.text.body);
        if(localisedStrings.Questions === body.text.body){
          await this.message.sendAnswer(from, userData.language);
        }
        await this.message.Followupbuttons(from, userData.language);
      } else if (persistent_menu_response) {
        await this.message.languageButtons(from, userData.language);
      } else if (
        button_response &&
        localisedStrings.languageButtons.includes(button_response.body)
      ) {
        let language= await this.userService.saveLanguage(from, botID, button_response.body);
        await this.message.buttonoptions(from, language.language);
      } 
      else if (
        button_response &&
        localisedStrings.back_to_main_menu.includes(button_response.body)
      ) {
        await this.message.buttonoptions(from, userData.language);
        await this.userService.saveButtonResponse(from,this.botId,localisedStrings.back_to_main_menu);
      } else if (
        button_response &&
        localisedStrings.morebuttons.includes(button_response.body)
      ) {
        
        if (button_response.body === localisedStrings.morebuttons[0]) {
          await this.message.buttonoptions(from, userData.language);
          await this.userService.saveButtonResponse(from,this.botId,localisedStrings.morebuttons[0]);
        } else if (button_response.body === localisedStrings.morebuttons[1]) {
          await this.message.sendAskQuestionMessage(from, userData.language);
          await this.userService.saveButtonResponse(from,this.botId,localisedStrings.morebuttons[1]);
        }
      } else {
        console.log('Response not provided');
      }

      return 'ok';
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
}
