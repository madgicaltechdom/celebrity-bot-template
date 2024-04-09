import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import { MessageService } from 'src/message/message.service';

dotenv.config();

@Injectable()
export class SwiftchatMessageService extends MessageService {
  private botId = process.env.BOT_ID;
  private apiKey = process.env.API_KEY;
  private apiUrl = process.env.API_URL;
  private baseUrl = `${this.apiUrl}/${this.botId}/messages`;

  private prepareRequestData(from: string, requestBody: string): any {
    return {
      to: from,
      type: 'text',
      text: {
        body: requestBody,
      },
    };
  }
  


  async sendWelcomeMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
   console.log(localisedStrings.welcomeMessage)
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.welcomeMessage,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    console.log(this.baseUrl)
    console.log(this.apiKey)
    console.log(response)
    return response;
  }

  
  async sendAboutCelebrityMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
   console.log(localisedStrings.about_celebrity)
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.about_celebrity,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    console.log(this.baseUrl)
    console.log(this.apiKey)
    console.log(response)
    return response;
  }
  async sendLatestNewsMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
   console.log(localisedStrings.latest_news)
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.latest_news,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    console.log(this.baseUrl)
    console.log(this.apiKey)
    console.log(response)
    return response;
  }
  async sendSocialmediaMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
   console.log(localisedStrings.social_media)
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.social_media,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    console.log(this.baseUrl)
    console.log(this.apiKey)
    console.log(response)
    return response;
  }

  async sendAskQuestionMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
   console.log(localisedStrings.ask_a_questin)
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.ask_a_question,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    console.log(this.baseUrl)
    console.log(this.apiKey)
    console.log(response)
    return response;
  }
  async sendReportProblemMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
   console.log(localisedStrings.report_problem)
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.report_problem,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    console.log(this.baseUrl)
    console.log(this.apiKey)
    console.log(response)
    return response;
  }

  async sendLanguageChangedMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.select_language,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }
  

  async buttonoptions(from: string, language: string): Promise<void> {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const url = `${this.apiUrl}/${this.botId}/messages`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: {
            body: localisedStrings.button_option_body,
          },
        },
        buttons: localisedStrings.button_options,
        allow_custom_response: false,
      },
    };    
    try {
      const response = await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('errors:', error);
    }
  }

  async languageButtons(from: string, language: string): Promise<void> {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const url = `${this.apiUrl}/${this.botId}/messages`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: {
            body: localisedStrings.languageBody,
          },
        },
        buttons: [
          {
            type: 'solid',
            body: 'Hindi',
            reply: 'Hindi',
          },
          {
            type: 'solid',
            body: 'English',
            reply: 'English',
          },
        ],
        allow_custom_response: false,
      },
    };
    try {
      const response = await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('errors:', error);
    }
  }
  async goBackToMainMenu(from: string, language: string): Promise<void> {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const url = `${this.apiUrl}/${this.botId}/messages`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: {
            body: localisedStrings.backMainMenuMessage,
          },
        },
        buttons: localisedStrings.go_back_to_main_menu,
        allow_custom_response: false,
      },
    };
    try {
      const response = await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('errors:', error);
    }
  };
  async Followupbuttons(from: string, language: string): Promise<void> {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const url = `${this.apiUrl}/${this.botId}/messages`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: {
            body: localisedStrings.backMainewAskMessage,
          },
        },
        buttons: localisedStrings.mainmenu_ask_a_new_question,
        allow_custom_response: false,
      },
    };
    try {
      const response = await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('errors:', error);
    }
  };
    
}
