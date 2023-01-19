import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/api/user/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const existUser = await this.userService.findUserByUserId(payload.user_id);

    if (!existUser) {
      throw new UnauthorizedException('회원정보가 존재하지 않습니다.');
    }

    return payload.user_id;
  }
}
