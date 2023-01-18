import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          // console.log(request);
          const { authorization } = request.headers;
          console.log(authorization);
          const refreshToken = authorization.split(' ')[1];
          console.log(refreshToken);
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(request: Request) {
    // console.log(request);
    const { authorization } = request.headers;
    console.log(authorization);
    const refreshToken = authorization.split(' ')[1];
    console.log(refreshToken);

    return this.authService.getUserRefreshTokenToMatches(refreshToken);
  }
}
