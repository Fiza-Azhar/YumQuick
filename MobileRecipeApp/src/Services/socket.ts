//MobileRecipeApp/src/Services/socket.ts
import { io, Socket } from 'socket.io-client';
import config from '../config.ts';


const SOCKET_URL = config.recipes;  // Replace with your backend URL

export const socket: Socket = io(SOCKET_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

export default socket;