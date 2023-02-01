import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  UnauthorizedException,
  ForbiddenException,
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

  async validateUser(login_id: string, password: string) {
    const existsUser = await this.userRepository.findUserByLoginId(login_id);

    if (!existsUser) {
      throw new UnauthorizedException('아이디 또는 비밀번호를 확인해주세요');
    }

    const matchedPassword = await bcrypt.compare(password, existsUser.password);

    if (!matchedPassword) {
      throw new UnauthorizedException('아이디 또는 비밀번호를 확인해주세요');
    }

    return existsUser;
  }

  async deleteRefreshToken(user_id: string) {
    await this.cacheManager.del(user_id);
    return true;
  }

  async createAccessTokenRefreshToken(user_id: number) {
    const payload = { user_id };

    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);

    await this.cacheManager.set(user_id + '', refreshToken, {
      ttl: +process.env.REFRESH_TOKEN_EXP,
    } as any);

    return { accessToken, refreshToken };
  }

  async createAccessToken(payload: object) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: `${process.env.ACCESS_TOKEN_EXP}s`,
    });

    return accessToken;
  }

  async createRefreshToken(payload: object) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: `${process.env.REFRESH_TOKEN_EXP}s`,
    });

    return refreshToken;
  }

  async getUserRefreshTokenToMatches(user_id: number) {
    console.log(user_id);
    const refreshToken = await this.cacheManager.get(user_id + '');
    console.log(refreshToken);
    if (!refreshToken) {
      throw new ForbiddenException('리프레쉬 토큰이 존재하지 않습니다');
    }

    return user_id;
  }
}
