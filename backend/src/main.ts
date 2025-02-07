//src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
/**
 * main file of backend
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://192.168.16.122:8081'],   
   //origin: ['http://localhost:8081'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

/**
 * listens to port 5000
 */
 await app.listen(5000, '0.0.0.0');
 //await app.listen(5000);
  console.log('Server is running on port 5000');
}

bootstrap();



