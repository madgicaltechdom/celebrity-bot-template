import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) {}
  async createUser(
    mobileNumber: string,
    botID: string,
  ): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber);
    if (existingUser) {
      existingUser.mobileNumber=mobileNumber;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.id = uuidv4();
      newUser.botID = botID; 
      newUser.userContext = ''; 
      newUser.buttonResponse = ''; 
      newUser.name='';
      newUser.address='',
      newUser.language = 'English'; 
      return this.userRepository.save(newUser);
    }
  }

  async findUserByMobileNumber(
    mobileNumber: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { mobileNumber } });
  }

  async saveUser(user: User): Promise<User | undefined> {
    return this.userRepository.save(user);
  }
  async saveButtonResponse(mobileNumber: string, botID: string,buttonResponse:string): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber);
    if (existingUser) {
      existingUser.buttonResponse = buttonResponse;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.id = uuidv4(); 
      newUser.botID = botID; 
      newUser.userContext = ''; 
      newUser.buttonResponse = buttonResponse;
      newUser.language = 'English'; 
      newUser.name='';
      newUser.address='';
      return this.userRepository.save(newUser);
    }
  };

  async updateUsercontext(mobileNumber: string, botID: string,user_context:string): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber);
    if (existingUser) {
      existingUser.userContext = user_context;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.id = uuidv4(); 
      newUser.botID = botID; 
      newUser.userContext = user_context; 
      newUser.buttonResponse = null;
      newUser.language = 'English'; 
      newUser.name='';
      newUser.address='';
      return this.userRepository.save(newUser);
    }
  };
  async saveLanguage(mobileNumber: string, botID: string,language:string): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber);
    if (existingUser) {
      console.log("language recieved", language)
      existingUser.language = language;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.id = uuidv4(); 
      newUser.botID = botID; 
      newUser.userContext = ''; 
      newUser.buttonResponse = '';
      newUser.language = language; 
      newUser.name='';
      newUser.address='';
      return this.userRepository.save(newUser);
    }
  };

  async saveName(mobileNumber: string, botID: string,name: string): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber);
    if (existingUser) {
      existingUser.name = name;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.id = uuidv4(); 
      newUser.botID = botID; 
      newUser.userContext = ''; 
      newUser.buttonResponse = '';
      newUser.language = 'English'; 
      newUser.name= name;
      newUser.address='';
      return this.userRepository.save(newUser);
    }
  };
  async saveAddress(mobileNumber: string, botID: string,address: string): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber);
    if (existingUser) {
      existingUser.address = address;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.id = uuidv4(); 
      newUser.botID = botID; 
      newUser.userContext = ''; 
      newUser.buttonResponse = '';
      newUser.language = 'English'; 
      newUser.name= '';
      newUser.address=address;
      return this.userRepository.save(newUser);
    }
  };
}

