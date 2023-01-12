import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { UserService } from 'src/api/user/service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
@UseInterceptors(GlobalResponseInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 회원가입
  @Post('/signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.userService.signUp(createUserDto);

    return { message: '회원가입에 성공했습니다.' };
  }

  // 로그인
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const login_id = req.user as string;

    const { accessToken, refreshToken } =
      await this.authService.createAccessTokenRefreshToken(login_id);

    res.setHeader('accessToken', `Bearer ${accessToken}`);
    res.setHeader('refreshToken', `Bearer ${refreshToken}`);

    return { message: `${login_id} 로그인 성공` };
  }

  // 로그아웃
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/logout')
  async logout(@Req() req: Request) {
    const { refreshToken }: any = req.user;
    console.log(refreshToken);
    await this.authService.logoutUser(refreshToken);

    return { message: '로그아웃 성공' };
  }

  // 엑세스 토큰 재발급
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh-token')
  async re(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { login_id }: any = req.user;

    const newAccessToken = await this.authService.getAccessToken({ login_id });

    res.setHeader('accessToken', `Bearer ${newAccessToken}`);

    return { message: '토큰 재발급 성공' };
  }
}
