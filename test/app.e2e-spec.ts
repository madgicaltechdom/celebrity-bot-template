import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { ChatbotService } from '../src/chat/chatbot.service';
import { UserService } from '../src/model/user.service';
import { MessageService } from '../src/message/message.service';
import { SwiftchatMessageService } from '../src/swiftchat/swiftchat.service';
import { localisedStrings as english } from '../src/i18n/en/localised-strings';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/model/user.entity';
import { Repository } from 'typeorm';
import IntentClassifier  from '../src/intent/intent.classifier';
import { LocalizationService } from '../src/localization/localization.service';
import { aboutcelebrityService } from '../src/chat/aboutcelebrity.service';
import { latestnewsService } from '../src/chat/latestnews.service';
import { socialmediaService } from '../src/chat/socialmedia.service';
import { askquestionService } from '../src/chat/askaquestion.service';
import { reportproblemService } from '../src/chat/reportproblem.serive';

describe('AppController', () => {
  let messageService: MessageService;
  let userService: UserService;
  let aboutCeleb: aboutcelebrityService;
  let latestnews: latestnewsService;
  let socialmedia: socialmediaService;
  let askquestion: askquestionService;
  let reportproblem: reportproblemService;
  let chatbotService: ChatbotService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        IntentClassifier,
        ChatbotService,
        aboutcelebrityService,
        latestnewsService,
        socialmediaService,
        askquestionService,
        reportproblemService,
        SwiftchatMessageService,
       {
        provide: MessageService,
        useFactory: () => ({
          sendWelcomeMessage:jest.fn(),
           sendLanguageChangedMessage: jest.fn(),
          buttonoptions: jest.fn(),
           goBackToMainMenu: jest.fn(),
           languageButtons: jest.fn(),
           Followupbuttons: jest.fn(),

        }),
       },
        UserService,{
          provide: getRepositoryToken(User),
          useClass: Repository,
        }
      ],
    }).compile();
    messageService=module.get<MessageService>(MessageService);
    userService = module.get<UserService>(UserService);
    chatbotService = module.get<ChatbotService>(ChatbotService);
    aboutCeleb=module.get<aboutcelebrityService>(aboutcelebrityService);
    latestnews=module.get<latestnewsService>(latestnewsService);
    socialmedia=module.get<socialmediaService>(socialmediaService);
    askquestion=module.get<askquestionService>(askquestionService);
    reportproblem=module.get<reportproblemService>(reportproblemService);
  });

  it("should send welcome message and category buttons when valid 'from' and 'text' are provided", async () => {
    jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
      id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
      mobileNumber: '1234567890',
      botID: '0238981860238953',
      userContext: '',
      buttonResponse: '',
      name:'',
      address:'',
      language: 'English',
    });

    const body = {
      from: '1234567890',
      text: { body: 'hi' },
      button_response: null,
      persistent_menu_response: null,
    };

    await chatbotService.processMessage(body);

    expect(messageService.sendWelcomeMessage).toHaveBeenCalledWith(
      '1234567890',
      'English',
    );
    expect(messageService.buttonoptions).toHaveBeenCalledWith(
      '1234567890',
      'English',
    );
  });

  it("should display language buttons after selecting persistent menu", async () => {
    jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
      id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
      mobileNumber: '1234567890',
      botID: '0238981860238953',
      userContext: '',
      name:'',
      address:'',
      buttonResponse: '',
      language: 'English',
    });

    const body = {
      from: '1234567890',
      text: null,
      button_response: null,
      persistent_menu_response: { body: 'English' },
    };

    await chatbotService.processMessage(body);

    expect(messageService.languageButtons).toHaveBeenCalledWith(
      '1234567890',
      'English',
    );
    
  });

  it("should display about the Celebrity and Back to menu button after the user selects a about Celebrity Category", async () => {
    jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
      id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
      mobileNumber: '1234567890',
      botID: '0238981860238953',
      userContext: '',
      name:'',
      address:'',
      buttonResponse: '',
      language: 'English',
    });


    const body = {
      from: '1234567890',
      text: null,
      button_response: { body: 'About the Celebrity' },
      persistent_menu_response: null,
    };
    jest.spyOn(userService, 'findUserByMobileNumber').mockResolvedValue({
      id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
      mobileNumber: '1234567890',
      botID: '0238981860238953',
      userContext: '',
      name:'',
      address:'',
      buttonResponse: '',
      language: 'English',
    });

    jest.spyOn(userService, 'saveButtonResponse').mockResolvedValue({
      id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
      mobileNumber: '1234567890',
      botID: '0238981860238953',
      userContext: '',
      name:'',
      address:'',
      buttonResponse: '',
      language: 'English',
    });

    jest
      .spyOn(LocalizationService, 'getLocalisedString')
      .mockResolvedValueOnce(english);

      jest
      .spyOn(messageService, 'buttonoptions')
      .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });

      jest
      .spyOn(aboutCeleb, 'sendAboutCelebrityMessage')
      .mockResolvedValueOnce({id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66'})

       await chatbotService.processMessage(body);

      // Assert
      expect(userService.findUserByMobileNumber).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(LocalizationService.getLocalisedString).toHaveBeenCalledWith(
        'English',
      );
      expect(aboutCeleb.sendAboutCelebrityMessage).toHaveBeenCalledWith(
        '1234567890',
        'English'
      );
      expect(messageService.goBackToMainMenu).toHaveBeenCalledWith(
        '1234567890',
        'English',
      );
      expect(userService.saveButtonResponse).toHaveBeenCalledWith(
        '1234567890',
        process.env.BOT_ID,
        'About the Celebrity',
      );
    });

    it("should display latest news and follow-up buttons after the user selects a Latest news or projects Category", async () => {
      jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
        id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
        mobileNumber: '1234567890',
        botID: '0238981860238953',
        userContext: '',
        name:'',
        address:'',
        buttonResponse: '',
        language: 'English',
      });
  
      const body = {
        from: '1234567890',
        text: null,
        button_response: { body: 'Latest News and Projects'},
        persistent_menu_response: null,
      };
      jest.spyOn(userService, 'findUserByMobileNumber').mockResolvedValue({
        id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
        mobileNumber: '1234567890',
        botID: '0238981860238953',
        userContext: '',
        name:'',
        address:'',
        buttonResponse: '',
        language: 'English',
      });
  
      jest.spyOn(userService, 'saveButtonResponse').mockResolvedValue({
        id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
        mobileNumber: '1234567890',
        botID: '0238981860238953',
        userContext: '',
        name:'',
        address:'',
        buttonResponse: '',
        language: 'English',
      });
  
      jest
        .spyOn(LocalizationService, 'getLocalisedString')
        .mockResolvedValueOnce(english);
  
        jest
        .spyOn(messageService, 'buttonoptions')
        .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });
  
        jest
        .spyOn(latestnews, 'sendLatestNewsMessage')
        .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });
         await chatbotService.processMessage(body);
  
        // Assert
       
        expect(userService.findUserByMobileNumber).toHaveBeenCalledWith(
          '1234567890',
        );
        expect(LocalizationService.getLocalisedString).toHaveBeenCalledWith(
          'English',
        );

        expect(latestnews.sendLatestNewsMessage).toHaveBeenCalledWith(
          '1234567890',
          'English'
        );
  
        expect(messageService.Followupbuttons).toHaveBeenCalledWith(
          '1234567890',
          'English',
        );
        expect(userService.saveButtonResponse).toHaveBeenCalledWith(
          '1234567890',
          process.env.BOT_ID,
          'Latest News and Projects',
        );
      });

      it("should display social media links and Back to menu button after the user selects social media Category", async () => {
        jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
          id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
          mobileNumber: '1234567890',
          botID: '0238981860238953',
          userContext: '',
          name:'',
          address:'',
          buttonResponse: '',
          language: 'English',
        });
    
    
        const body = {
          from: '1234567890',
          text: null,
          button_response: { body: 'Social Media Links' },
          persistent_menu_response: null,
        };
        jest.spyOn(userService, 'findUserByMobileNumber').mockResolvedValue({
          id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
          mobileNumber: '1234567890',
          botID: '0238981860238953',
          userContext: '',
          buttonResponse: '',
          name:'',
          address:'',
          language: 'English',
        });
    
        jest.spyOn(userService, 'saveButtonResponse').mockResolvedValue({
          id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
          mobileNumber: '1234567890',
          botID: '0238981860238953',
          userContext: '',
          buttonResponse: '',
          name:'',
          address:'',
          language: 'English',
        });
    
        jest
          .spyOn(LocalizationService, 'getLocalisedString')
          .mockResolvedValueOnce(english);
    
          jest
          .spyOn(messageService, 'buttonoptions')
          .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });

          jest
        .spyOn(socialmedia, 'sendSocialmediaMessage')
        .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });
    
        await chatbotService.processMessage(body);
    
          // Assert
          expect(userService.findUserByMobileNumber).toHaveBeenCalledWith(
            '1234567890',
          );
          expect(LocalizationService.getLocalisedString).toHaveBeenCalledWith(
            'English',
          );
          expect(socialmedia.sendSocialmediaMessage).toHaveBeenCalledWith(
            '1234567890',
            'English'
          );
          expect(messageService.goBackToMainMenu).toHaveBeenCalledWith(
            '1234567890',
            'English',
          );
          expect(userService.saveButtonResponse).toHaveBeenCalledWith(
            '1234567890',
            process.env.BOT_ID,
            'Social Media Links',
          );
        });

          it('should save the language and show the main menu in the selected language when the language button is clicked', async () => {
            jest.spyOn(userService, 'saveLanguage').mockResolvedValue({
              id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
              mobileNumber: '1234567890',
              botID: '0238981860238953',
              userContext: '',
              buttonResponse: '',
              name:'',
              address:'',
              language: 'English',
            });
            jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
              id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
              mobileNumber: '1234567890',
              botID: '0238981860238953',
              userContext: '',
              name:'',
              address:'',
              buttonResponse: '',
              language: 'English',
            });
        
            const body = {
              from: '1234567890',
              text: null,
              button_response: { body: 'English'},
              persistent_menu_response: null,
            };
            jest.spyOn(userService, 'findUserByMobileNumber').mockResolvedValue({
              id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
              mobileNumber: '1234567890',
              botID: '0238981860238953',
              userContext: '',
              name:'',
              address:'',
              buttonResponse: '',
              language: 'English',
            });
        
            jest
              .spyOn(LocalizationService, 'getLocalisedString')
              .mockResolvedValueOnce(english);
        
              jest
              .spyOn(messageService, 'buttonoptions')
              .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });
        
              const result = await chatbotService.processMessage(body);
        
              // Assert
              expect(result).toBe('ok');
              expect(userService.findUserByMobileNumber).toHaveBeenCalledWith(
                '1234567890',
              );
              expect(LocalizationService.getLocalisedString).toHaveBeenCalledWith(
                'English',
              );

              expect(userService.saveLanguage).toHaveBeenCalledWith(
                   '1234567890',
                   process.env.BOT_ID,
                   'English',
                );
              expect(messageService.buttonoptions).toHaveBeenCalledWith(
                '1234567890',
                'English',
              );
    
            }); 

            it('should save the language and show the main menu in the selected language when the language button is clicked', async () => {
            jest.spyOn(userService, 'saveLanguage').mockResolvedValue({
              id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
              mobileNumber: '1234567890',
              botID: '0238981860238953',
              userContext: '',
              name:'',
              address:'',
              buttonResponse: '',
              language: 'English',
            });
            jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
              id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
              mobileNumber: '1234567890',
              botID: '0238981860238953',
              userContext: '',
              buttonResponse: '',
              name:'',
              address:'',
              language: 'English',
            });
        
            const body = {
              from: '1234567890',
              text: null,
              button_response: { body: 'English'},
              persistent_menu_response: null,
            };
            jest.spyOn(userService, 'findUserByMobileNumber').mockResolvedValue({
              id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
              mobileNumber: '1234567890',
              botID: '0238981860238953',
              userContext: '',
              name:'',
              address:'',
              buttonResponse: '',
              language: 'English',
            });
        
            jest
              .spyOn(LocalizationService, 'getLocalisedString')
              .mockResolvedValueOnce(english);
        
              jest
              .spyOn(messageService, 'buttonoptions')
              .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });
        
              const result = await chatbotService.processMessage(body);
        
              // Assert
              expect(result).toBe('ok');
              expect(userService.findUserByMobileNumber).toHaveBeenCalledWith(
                '1234567890',
              );
              expect(LocalizationService.getLocalisedString).toHaveBeenCalledWith(
                'English',
              );

              expect(userService.saveLanguage).toHaveBeenCalledWith(
                   '1234567890',
                   process.env.BOT_ID,
                   'English',
                );
              expect(messageService.buttonoptions).toHaveBeenCalledWith(
                '1234567890',
                'English',
              );
    
            }); 

            it("should display ask a question message after the user selects ask a question Category", async () => {
              jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
                id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
                mobileNumber: '1234567890',
                botID: '0238981860238953',
                userContext: '',
                name:'',
                address:'',
                buttonResponse: '',
                language: 'English',
              });
          
          
              const body = {
                from: '1234567890',
                text: null,
                button_response: { body: 'Ask a question' },
                persistent_menu_response: null,
              };
              jest.spyOn(userService, 'findUserByMobileNumber').mockResolvedValue({
                id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
                mobileNumber: '1234567890',
                botID: '0238981860238953',
                userContext: '',
                name:'',
                address:'',
                buttonResponse: '',
                language: 'English',
              });
          
              jest.spyOn(userService, 'saveButtonResponse').mockResolvedValue({
                id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
                mobileNumber: '1234567890',
                botID: '0238981860238953',
                userContext: '',
                name:'',
                address:'',
                buttonResponse: '',
                language: 'English',
              });
          
              jest
                .spyOn(LocalizationService, 'getLocalisedString')
                .mockResolvedValueOnce(english);
          
      
                jest
              .spyOn(askquestion, 'sendAskQuestionMessage')
              .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });
          
              await chatbotService.processMessage(body);
          
                // Assert
                expect(userService.findUserByMobileNumber).toHaveBeenCalledWith(
                  '1234567890',
                );
                expect(LocalizationService.getLocalisedString).toHaveBeenCalledWith(
                  'English',
                );
                expect(askquestion.sendAskQuestionMessage).toHaveBeenCalledWith(
                  '1234567890',
                  'English'
                );
              });

              it("should correctly send a report problem message with a back to main menu button option", async () => {
                jest.spyOn(userService.userRepository, 'findOne').mockResolvedValue({
                  id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
                  mobileNumber: '1234567890',
                  botID: '0238981860238953',
                  userContext: '',
                  name:'',
                  address:'',
                  buttonResponse: '',
                  language: 'English',
                });
            
            
                const body = {
                  from: '1234567890',
                  text: null,
                  button_response: { body: 'Report a Problem' },
                  persistent_menu_response: null,
                };
                jest.spyOn(userService, 'findUserByMobileNumber').mockResolvedValue({
                  id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
                  mobileNumber: '1234567890',
                  botID: '0238981860238953',
                  userContext: '',
                  name:'',
                  address:'',
                  buttonResponse: '',
                  language: 'English',
                });
            
                jest.spyOn(userService, 'saveButtonResponse').mockResolvedValue({
                  id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66',
                  mobileNumber: '1234567890',
                  botID: '0238981860238953',
                  userContext: '',
                  name:'',
                  address:'',
                  buttonResponse: '',
                  language: 'English',
                });
            
                jest
                  .spyOn(LocalizationService, 'getLocalisedString')
                  .mockResolvedValueOnce(english);
        
                  jest
                .spyOn(reportproblem, 'sendReportProblemMessage')
                .mockResolvedValueOnce({ id: '359a2e1e-ddb9-4cc5-8029-062bdf54bd66' });
                await chatbotService.processMessage(body);
            
            
                  // Assert
                  expect(userService.findUserByMobileNumber).toHaveBeenCalledWith(
                    '1234567890',
                  );
                  expect(LocalizationService.getLocalisedString).toHaveBeenCalledWith(
                    'English',
                  );
                  expect(reportproblem.sendReportProblemMessage).toHaveBeenCalledWith(
                    '1234567890',
                    'English'
                  );
                  expect(messageService.goBackToMainMenu).toHaveBeenCalledWith(
                    '1234567890',
                    'English',
                  );
                  
                });
});
