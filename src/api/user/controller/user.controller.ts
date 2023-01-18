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
  Param,
  Put,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { UserService } from 'src/api/user/service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { KakaoAuthGuard } from 'src/auth/kakao/kaka-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';

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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user_id = req.user as number;

    const { accessToken, refreshToken } =
      await this.authService.createAccessTokenRefreshToken(user_id);

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }

  // 카카오 로그인
  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  // 카카오 로그인 콜백
  @UseGuards(KakaoAuthGuard)
  @Get('/auth/kakao/callback')
  async kakaoLoginCallBack(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = req.user;

    res.setHeader('accessToken', `Bearer ${accessToken}`);
    res.setHeader('refreshToken', `Bearer ${refreshToken}`);

    return { message: 'ok' };
  }

  // 로그아웃
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/logout')
  async logout(@Req() req) {
    const { refreshToken } = req.user;
    await this.authService.deleteRefreshToken(refreshToken);

    return { message: '로그아웃 성공' };
  }

  // 찜하기
  @UseGuards(AuthGuard('jwt'))
  @Put('/feeds/:feedId/pick')
  async pickedFeed(@Req() req, @Param('feedId', ParseIntPipe) feed_id: number) {
    const user_id = req.user as number;

    // 합쳐지면 feed service 확인 후 존재하는 게시물인지
    // 확인하는 로직 추가

    const chkPicked = await this.userService.chkPicked(user_id, feed_id);

    if (!chkPicked) {
      return { message: '찜하기가 취소되었습니다.' };
    }

    return { message: '찜목록에 추가되었습니다.' };
  }

  // 프로필 수정
  // @UseGuards(AuthGuard('jwt'))
  @Patch('/edit')
  async updatedProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    // const user_id = req.user;
    const user_id = 1;

    await this.userService.updatedProfile(user_id, updateUserDto);

    return { message: '프로필 수정 성공' };
  }

  // // 마이 페이지
  // @UseGuards(AuthGuard('jwt'))
  @Get('/mypage')
  async myPage(@Req() req) {
    // const user_id = req.user;
    const user_id = 1;

    return this.userService.getMypageInfo(user_id);
  }

  // 엑세스 토큰 재발급
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh-token')
  async reIssue(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { user_id }: any = req.user;
    const newAccessToken = await this.authService.createAccessToken({
      user_id,
    });

    return {
      accessToken: `Bearer ${newAccessToken}`,
    };
  }
}
