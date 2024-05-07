import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from '../message/message.service';
import { UserService } from '../model/user.service';
import { aboutcelebrityService } from './aboutcelebrity.service';
import { LocalizationService } from '../localization/localization.service';
import { latestnewsService } from './latestnews.service';
import { socialmediaService } from './socialmedia.service';
import { askquestionService } from './askaquestion.service';
import { localisedStrings as english } from '../i18n/en/localised-strings';
import { reportproblemService } from './reportproblem.serive';


@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;
  private readonly aboutceleb: aboutcelebrityService;
  private readonly latestnews: latestnewsService;
  private readonly socialmedia: socialmediaService;
  private readonly askquestion: askquestionService;
  private readonly report: reportproblemService;
  private readonly botId=process.env.Bot_id;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    aboutceleb: aboutcelebrityService,
    latestnews: latestnewsService,
    socialmedia: socialmediaService,
    askquestion: askquestionService,
    report: reportproblemService,
    userService: UserService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.aboutceleb= aboutceleb;
    this.latestnews= latestnews;
    this.socialmedia=socialmedia;
    this.askquestion=askquestion;
    this.report=report;
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

      console.log(userData);
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
          await this.aboutceleb.sendAboutCelebrityMessage(from, userData.language);
            await this.message.goBackToMainMenu(from, userData.language);
            await this.userService.updateUsercontext(from,botID,english.context[0]); 
            await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[0])
        } else if(button_response.body=== localisedStrings.category_list[1]){
          await this.latestnews.sendLatestNewsMessage(from, userData.language);
            await this.message.Followupbuttons(from, userData.language);
            await this.userService.updateUsercontext(from,botID,english.context[1]); 
            await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[1])
        }
        else if(button_response.body=== localisedStrings.category_list[2]){
          await this.socialmedia.sendSocialmediaMessage(from, userData.language);
          await this.message.goBackToMainMenu(from, userData.language);
          await this.userService.updateUsercontext(from,botID,english.context[2]); 
          await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[2])
        } else if(button_response.body === localisedStrings.category_list[3]){

          await this.askquestion.sendAskQuestionMessage(from, userData.language);
          await this.userService.saveButtonResponse(from,this.botId,localisedStrings.category_list[3])
          await this.userService.updateUsercontext(from,botID,english.context[3]); 

        } else if(button_response.body === localisedStrings.category_list[4]){
          await this.report.sendAskNameMessage(from,userData.language);
          await this.userService.updateUsercontext(from,botID,localisedStrings.context[4]);
          await this.userService.saveButtonResponse(from,this.botId,english.category_list[4])
        }
      } else if(!button_response && !persistent_menu_response && userData.userContext=== english.context[4]){
        await this.userService.saveName(from,botID,body.text.body)
        await this.report.sendAskAddressMessage(from,userData.language);
        await this.userService.updateUsercontext(from,botID,english.context[5]); 
      } else if(!button_response  && !persistent_menu_response && userData.userContext=== english.context[5]){
        await this.userService.saveAddress(from,botID,body.text.body);
        await this.report.sendReportProblemMessage(from,userData.language);
        await this.userService.updateUsercontext(from,botID,english.context[6]);
      } else if(!button_response && !persistent_menu_response && userData.userContext=== english.context[6]){
        await this.report.sendThankyouessage(from,userData.language);
        await this.message.goBackToMainMenu(from, userData.language);
      }

      else if(!persistent_menu_response && !button_response && (userData.buttonResponse===localisedStrings.category_list[3] || userData.buttonResponse===localisedStrings.morebuttons[1])){
        await this.userService.updateUsercontext(from,userData.language, body.text.body);
        if(localisedStrings.Questions === body.text.body){
          await this.askquestion.sendAnswer(from, userData.language);
        }
        else{
          await this.askquestion.sendnoAnswer(from, userData.language);
        }
        await this.message.Followupbuttons(from, userData.language);
      } else if (persistent_menu_response) {
        await this.userService.updateUsercontext(from,botID,english.context[7]);
        await this.message.languageButtons(from, userData.language);
      }  else if (
        button_response &&
        localisedStrings.languageButtons.includes(button_response.body)
      ) {
        let language= await this.userService.saveLanguage(from, botID, button_response.body);
        await this.message.buttonoptions(from, language.language);
        await this.userService.updateUsercontext(from,botID,english.context[7]);
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
          await this.askquestion.sendAskQuestionMessage(from, userData.language);
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
