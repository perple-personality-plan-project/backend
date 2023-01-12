import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/api/user/user.repository';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginId: string, password: string) {
    const existsUser = await this.userRepository.findUserById(loginId);

    if (!existsUser) {
      throw new UnauthorizedException('아이디 또는 비밀번호를 확인해주세요');
    }

    const matchedPassword = await bcrypt.compare(password, existsUser.password);

    if (!matchedPassword) {
      throw new UnauthorizedException('아이디 또는 비밀번호를 확인해주세요');
    }

    return existsUser;
  }

  async createAccessTokenRefreshToken(loginId: string) {
    const payload = { loginId };

    const accessToken = await this.getAccessToken(payload);
    const refreshToken = await this.getRefreshToken();

    /*
     * Redis에 리프레시 토큰과 사용자 아이디 insert
     * 유효시간은 리프레시 토큰의 유효시간과 동일
     */
    await this.cacheManager.set(
      loginId,
      refreshToken,
      +process.env.REFRESH_TOKEN_EXP,
    );

    return { accessToken, refreshToken };
  }

  async getAccessToken(payload: object) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: `${process.env.ACCESS_TOKEN_EXP}s`,
    });

    return accessToken;
  }

  async getRefreshToken() {
    const refreshToken = this.jwtService.sign(
      {},
      {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: `${process.env.REFRESH_TOKEN_EXP}s`,
      },
    );

    return refreshToken;
  }
}
