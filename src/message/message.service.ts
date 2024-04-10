import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CustomException } from 'src/common/exception/custom.exception';
import { localisedStrings } from 'src/i18n/en/localised-strings';

@Injectable()
export abstract class MessageService {
  async prepareWelcomeMessage() {
    return localisedStrings.welcomeMessage;
  }
  getSeeMoreButtonLabel() {
    return localisedStrings.seeMoreMessage;
  }

  async sendMessage(baseUrl: string, requestData: any, token: string) {
    try {
      const response = await axios.post(baseUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new CustomException(error);
    }
  }

  abstract sendWelcomeMessage(from: string, language: string);
  abstract sendAboutCelebrityMessage(from: string, language: string);
  abstract sendLatestNewsMessage(from: string, language: string);
  abstract sendSocialmediaMessage(from: string, language: string);
  abstract sendAskQuestionMessage(from: string, language: string);
  abstract sendReportProblemMessage(from: string, language: string);
  abstract sendLanguageChangedMessage(from: string, language: string);
  abstract buttonoptions(from:string, language:string);
  abstract goBackToMainMenu(from: string, language: string);
  abstract languageButtons(from: string, language: string);
  abstract Followupbuttons(from: string, language: string);
  abstract sendAnswer(from: string, language: string);
  
}
