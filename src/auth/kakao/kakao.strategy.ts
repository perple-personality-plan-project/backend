import { Injectable } from '@nestjs/common';
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
    access_token: string,
    refresh_token: string,
    profile: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user = await this.userService.findUserById(profile.id);

    if (!user) {
      const newUser = await this.userService.signUp({
        login_id: profile.id,
        password: '',
        confirm_password: '',
        nickname: profile._json.kakao_account.email,
        mbti: '',
        provider: 'kakao',
      });

      user = newUser;
    }

    const { accessToken, refreshToken } =
      await this.authService.createAccessTokenRefreshToken(user.user_id);

    return { accessToken, refreshToken };
  }
}
