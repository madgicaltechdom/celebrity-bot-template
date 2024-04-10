import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppController } from '../src/app.controller';
import { ChatbotService } from '../src/chat/chatbot.service';
import { UserService } from '../src/model/user.service';
import * as dotenv from 'dotenv';
import { MessageService } from '../src/message/message.service';
import { SwiftchatMessageService } from '../src/swiftchat/swiftchat.service';
import axios from 'axios';
import { localisedStrings as english } from '../src/i18n/en/localised-strings';


describe('AppController (e2e)', () => {
  let MessageService: MessageService;
  let userService: UserService;
  let chatbotService: ChatbotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        ChatbotService,
        SwiftchatMessageService,
       
        UserService,
      ],
    }).compile();
  
    userService = module.get<UserService>(UserService);
    chatbotService = module.get<ChatbotService>(ChatbotService);
  });

});
