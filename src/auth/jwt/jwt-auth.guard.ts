import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new UnauthorizedException('토큰 타입이 일치하지 않습니다.');
    }

    const { loginId } = await this.validateAccessToken(token);

    request.user = loginId;

    return true;
  }

  async validateAccessToken(token: string) {
    try {
      const verify = await this.authService.tokenValidate(
        token,
        process.env.ACCESS_TOKEN_KEY,
      );

      return verify;
    } catch (error) {
      switch (error.message) {
        case 'invalid token':
        case 'jwt malformed':
          throw new ForbiddenException('유효하지 않은 토큰입니다.');

        case 'jwt expired':
          throw new UnauthorizedException('유효시간이 만료되었습니다.');

        default:
          throw new InternalServerErrorException('서버 오류');
      }
    }
  }
}
