//jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
/**
 * JwtStrategy is the custom strategy for handling JWT authentication.
 * It extends the PassportStrategy and is configured to use the JWT strategy.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //secretOrKey: process.env.JWT_SECRET, // Use your secret here
      secretOrKey:'qr0JTDheyxD6VA5YoWHMknjpYngyS7Pc',
    });
  }
 /**
   * Validates the payload of the JWT.
   * 
   * @param payload - The decoded JWT payload containing user information.
   * @returns The validated user object, including userId and username.
   * 
   * @remarks
   * This method is called automatically by the Passport module to ensure the JWT is valid.
   * The returned object will be attached to the request object, allowing you to access it in your route handlers.
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
 