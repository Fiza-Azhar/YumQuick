// src/auth/auth.module.ts
//before jwt====================
/*
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../recipe/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
*/


// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../recipe/schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard'; 
/**
 * The AuthModule is responsible for managing authentication-related functionality within the application.
 * It imports necessary modules, provides the authentication services, and exports them for use in other parts of the application.
 */
@Module({
  imports: [
       /**
     * MongooseModule integrates with MongoDB using Mongoose.
     * This setup defines the User schema to be used within this module.
     */
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
     /**
     * JwtModule is used to handle JWT (JSON Web Token) authentication.
     * The module is configured with a secret key and options like token expiration.
     * 
     * Note: The secret should be securely stored and managed (e.g., environment variables).
     */
    JwtModule.register({
      secret: 'qr0JTDheyxD6VA5YoWHMknjpYngyS7Pc',  // Use your secret here
      signOptions: { expiresIn: '10d' },
    }),
  ],
   /**
   * Providers are services or strategies that are injectable across the application.
   * AuthService handles the business logic for authentication.
   * JwtStrategy defines the strategy for validating JWT tokens.
   * JwtAuthGuard provides guard functionality to protect routes using JWT.
   */
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
   /**
   * The AuthController is responsible for handling incoming requests related to authentication.
   */
  controllers: [AuthController],
   /**
   * AuthService is exported so that it can be used in other modules within the application.
   */
  exports: [AuthService],
})
export class AuthModule {}
