//=============before session expire=============
/*
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../recipe/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
//import { JwtService } from '@nestjs/jwt';  // Import JwtService
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private otpMap = new Map<string, { otp: string, expires: number, username: string, password: string, email: string,  profilePhoto: string }>();

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signup(username: string, password: string, email: string, profilePhoto?: string): Promise<any> {
    // Generate OTP and set expiration time
    const otp = randomBytes(3).toString('hex'); // Generate a 6-digit OTP
    const otpExpires = Date.now() + 60000; // OTP expires in 1 minute

    // Store user data and OTP temporarily
    const userId = randomBytes(16).toString('hex'); // Generate a unique ID for temporary storage
    this.otpMap.set(userId, { otp, expires: otpExpires, username, password: await bcrypt.hash(password, 10), email, profilePhoto  });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'alishba.javed792@gmail.com',
        pass: 'jldj uhta vsji ukzs', // Replace with your generated App Password
      },
      port: 587,
      secure: false,
    });

    const mailOptions = {
      from: 'alishba.javed792@gmail.com',
      to: email,
      subject: 'OTP for Account Verification',
      text: `Your OTP for account verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    return { success: true, message: 'Signup successful. Please check your email for OTP.', userId };
  }

// src/auth/auth.service.ts

async verifyOtp(userId: string, otp: string): Promise<any> {
  const otpData = this.otpMap.get(userId);
  if (otpData) {
    if (otpData.expires > Date.now()) {
      if (otpData.otp === otp) {
        // Create user in database
        const user = new this.userModel({
          username: otpData.username,
          password: otpData.password,
          email: otpData.email,
          isVerified: true,
          profilePhoto: otpData.profilePhoto, // Save the profile photo URL
        });
        await user.save();

        // OTP is used, so delete it
        this.otpMap.delete(userId);

        return { success: true, message: 'Account successfully verified.' };
      }
      return { success: false, message: 'Invalid OTP.' };
    }
    return { success: false, message: 'OTP expired.' };
  }
  return { success: false, message: 'Invalid OTP or User ID.' };
}

//======before session jwt==============

async login(email: string, password: string): Promise<any> {
    // Find user by email
    const user = await this.userModel.findOne({ email });
    
    if (user && user.isVerified) {
      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        // Include additional fields in the response
        return {
          success: true,
          message: 'Login successful',
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
          profilePhoto: user.profilePhoto,  // Assuming profilePhoto is stored as a relative path
        };
      } else {
        return { success: false, message: 'Invalid password.' };
      }
    }
    
    return { success: false, message: 'User not found or not verified.' };
  }



  async logout(userId: string): Promise<any> {
    // This is where you can invalidate the session or token. The actual implementation depends on your authentication strategy.
    // For instance, if you're using JWT, you might simply return a success message since logout is handled client-side by deleting the token.

    // Example: If using sessions, you might destroy the session here:
    // req.session.destroy((err) => { ... });

    return { success: true, message: 'Logout successful' };
  }

  async deleteUser(userId: string): Promise<any> {
    try {
      const result = await this.userModel.findByIdAndDelete(userId);
      if (result) {
        return { success: true, message: 'User deleted successfully.' };
      } else {
        return { success: false, message: 'User not found.' };
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user.');
    }
  }
  
}
*/



//backend/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../recipe/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';  // Import JwtService
import { randomBytes } from 'crypto';
/**
 * AuthService handles all the authentication-related logic for user signup, login, OTP verification, and more.
 */
@Injectable()
export class AuthService {
  private otpMap = new Map<string, { otp: string, expires: number, username: string, password: string, email: string,  profilePhoto: string }>();

  /**
   * The constructor injects the User model and JwtService to handle database operations and JWT token creation.
   * @param userModel - Injected Mongoose model for User schema.
   * @param jwtService - Injected JwtService to handle JWT creation.
   */
  constructor(@InjectModel(User.name) private userModel: Model<User>,
  private jwtService: JwtService,) {}
  /**
   * Handles the signup process, including generating and sending an OTP via email.
   * @param username - The username of the new user.
   * @param password - The plain text password of the new user.
   * @param email - The email address of the new user.
   * @param profilePhoto - (Optional) The URL of the user's profile photo.
   * @returns A success message along with a userId for OTP verification.
   */
  async signup(username: string, password: string, email: string, profilePhoto?: string): Promise<any> {
    // Generate OTP and set expiration time
    const otp = randomBytes(3).toString('hex'); // Generate a 6-digit OTP
    const otpExpires = Date.now() + 60000; // OTP expires in 1 minute

    // Store user data and OTP temporarily
    const userId = randomBytes(16).toString('hex'); // Generate a unique ID for temporary storage
    this.otpMap.set(userId, { otp, expires: otpExpires, username, password: await bcrypt.hash(password, 10), email, profilePhoto  });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'alishba.javed792@gmail.com',
        pass: 'jldj uhta vsji ukzs', // Replace with your generated App Password
      },
      port: 587,
      secure: false,
    });

    const mailOptions = {
      from: 'alishba.javed792@gmail.com',
      to: email,
      subject: 'OTP for Account Verification',
      text: `Your OTP for account verification is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    return { success: true, message: 'Signup successful. Please check your email for OTP.', userId };
  }

// src/auth/auth.service.ts
  /**
   * Verifies the OTP provided by the user during signup.
   * If valid, creates the user in the database and deletes the OTP.
   * @param userId - The unique ID provided during signup for OTP verification.
   * @param otp - The OTP provided by the user for verification.
   * @returns A success message if OTP is valid, otherwise an error message.
   */
async verifyOtp(userId: string, otp: string): Promise<any> {
  const otpData = this.otpMap.get(userId);
  if (otpData) {
    if (otpData.expires > Date.now()) {
      if (otpData.otp === otp) {
        // Create user in database
        const user = new this.userModel({
          username: otpData.username,
          password: otpData.password,
          email: otpData.email,
          isVerified: true,
          profilePhoto: otpData.profilePhoto, // Save the profile photo URL
        });
        await user.save();

        // OTP is used, so delete it
        this.otpMap.delete(userId);

        return { success: true, message: 'Account successfully verified.' };
      }
      return { success: false, message: 'Invalid OTP.' };
    }
    return { success: false, message: 'OTP expired.' };
  }
  return { success: false, message: 'Invalid OTP or User ID.' };
}

  /**
   * Handles the login process by verifying the user's email and password.
   * If valid, returns a JWT token for the user.
   * @param email - The email address of the user.
   * @param password - The plain text password of the user.
   * @returns A success message with a JWT token if login is successful, otherwise an error message.
   */
  
async login(email: string, password: string): Promise<any> {
  // Find user by email
  const user = await this.userModel.findOne({ email });
  if (user && user.isVerified) {
    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Create JWT payload
      const payload = { username: user.username, sub: user._id };
      // Generate JWT token
      const accessToken = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Login successful',
        accessToken, // Include the token in the response
        username: user.username,
        profilePhoto: user.profilePhoto,
        userId: user._id.toString(),
      };
    } else {
      return { success: false, message: 'Invalid password.' };
    }
  }
  return { success: false, message: 'User not found or not verified.' };
}

  async deleteUser(userId: string): Promise<any> {
    try {
      const result = await this.userModel.findByIdAndDelete(userId);
      if (result) {
        return { success: true, message: 'User deleted successfully.' };
      } else {
        return { success: false, message: 'User not found.' };
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user.');
    }
  }
  
}
