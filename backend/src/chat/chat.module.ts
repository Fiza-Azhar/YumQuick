// backend/src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway],
  exports: [ChatGateway], // Export ChatGateway to be used in other modules
})
export class ChatModule {}
