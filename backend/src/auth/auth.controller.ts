// src/auth/auth.controller.ts
import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
/**
 * Controller responsible for handling user authentication-related requests.
 * It defines routes for signup, OTP verification, login, and user deletion.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

/**
   * Handles user signup requests.
   * 
   * @param body - The request body containing the user's username, email, password, and optional profile photo.
   * @returns A promise that resolves to the result of the signup process.
   * 
   * The method invokes the signup function of the AuthService,
   * which is responsible for registering a new user in the system.
   */
@Post('signup')
async signup(@Body() body: { username: string; email: string; password: string; profilePhoto?: string }) {
  return this.authService.signup(body.username, body.password, body.email, body.profilePhoto);
}

  /**
   * Handles OTP verification for a user.
   * 
   * @param body - The request body containing the user's ID and OTP.
   * @returns A promise that resolves to the result of the OTP verification process.
   * 
   * This method is typically called after a user signs up or logs in,
   * requiring them to verify their identity using an OTP sent to their email or phone.
   */
  @Post('verify')
  async verifyOtp(@Body() body: { userId: string; otp: string }) {
    return this.authService.verifyOtp(body.userId, body.otp);
  }

/**
   * Handles user login requests.
   * 
   * @param body - The request body containing the user's email and password.
   * @returns A promise that resolves to the result of the login process, 
   * including a token or session information if the login is successful.
   * 
   * The method calls the login function of the AuthService, 
   * which authenticates the user and provides access to the application.
   */
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }


    // New logout endpoint
    @Delete('users/:id')
    async deleteUser(@Param('id') id: string) {
      return this.authService.deleteUser(id);
    }
    
}
