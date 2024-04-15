import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { LocalizationService } from '../localization/localization.service';
import { MessageService } from '../message/message.service';

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
  
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.welcomeMessage,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
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
      const response = await axios.post(this.baseUrl, messageData, {
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
      const response = await axios.post(this.baseUrl, messageData, {
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
      const response = await axios.post(this.baseUrl, messageData, {
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
      const response = await axios.post(this.baseUrl, messageData, {
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
