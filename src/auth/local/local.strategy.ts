import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PassportStrategy } from '@nestjs/passport/dist';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'loginId',
      passwordField: 'password',
    });
  }

  async validate(loginId: string, password: string) {
    const user = await this.authService.validateUser(loginId, password);

    if (!user) {
      throw new UnauthorizedException('회원정보가 존재하지 않습니다');
    }

    return user;
  }
}
