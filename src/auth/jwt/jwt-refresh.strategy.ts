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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(request: Request) {
    const { authorization } = request.headers;
    const refreshToken = authorization.split(' ')[1];

    const login_id = await this.authService.getUserRefreshTokenToMatches(
      refreshToken,
    );

    return login_id;
  }
}
