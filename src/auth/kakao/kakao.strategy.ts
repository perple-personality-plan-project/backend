import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserService } from 'src/api/user/service/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(
    _: string,
    __: string,
    profile: any,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user_id: number;
    mbti: string;
  }> {
    if (!profile._json) {
      throw new UnauthorizedException('카카오 인증에 실패하였습니다.');
    }

    let user = await this.userService.findUserByLoginId(profile.id);

    if (!user) {
      const newUser = await this.userService.signUp({
        login_id: profile.id,
        password: '',
        confirm_password: '',
        nickname: profile.username,
        mbti: '',
        provider: 'kakao',
      });

      user = newUser;
    }

    const { accessToken, refreshToken } =
      await this.authService.createAccessTokenRefreshToken(user.user_id);

    return {
      accessToken,
      refreshToken,
      user_id: user.user_id,
      mbti: user.mbti,
    };
  }
}
