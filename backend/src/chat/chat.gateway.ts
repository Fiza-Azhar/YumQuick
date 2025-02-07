//backend/src/chat/chat.gateway.ts
/*

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('customEvent')
  handleCustomEvent(client: Socket, payload: any): void {
    console.log('Custom event received:', payload);
    this.server.emit('responseEvent', { message: 'Response from server' });
  }
}

*/

// backend/src/chat/chat.gateway.ts// backend/src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://192.168.16.122:8081', // Replace this with your frontend origin if different
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  sendNotification(event: string, payload: any): void {
    this.server.emit(event, payload);
  }

  // Method to broadcast a notification when a public recipe is added
  notifyPublicRecipeAdded(recipeName: string) {
    this.server.emit('publicRecipeNotification', {
      message: `Public recipe (${recipeName}) has been added.`,
    });
  }

  // Handle custom events sent from the client
  @SubscribeMessage('customEvent')
  handleCustomEvent(client: Socket, payload: any): void {
    this.logger.log(`Custom event received from ${client.id}: ${JSON.stringify(payload)}`);
    this.server.emit('responseEvent', { message: 'Response from server' });
  }
}
