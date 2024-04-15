// swiftchat.module.ts

import { Module } from '@nestjs/common';
import { SwiftchatMessageService } from './swiftchat.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [MessageModule], // Import MessageModule
  providers: [SwiftchatMessageService],
  exports: [SwiftchatMessageService],
})
export class SwiftchatModule {}
