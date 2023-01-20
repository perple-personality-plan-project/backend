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
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { KakaoAuthGuard } from 'src/auth/kakao/kaka-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseInterceptors(GlobalResponseInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.userService.signUp(createUserDto);

    return { message: '회원가입에 성공했습니다.' };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req) {
    const user_id = req.user;

    const { mbti } = await this.userService.findUserByUserId(user_id);

    const { accessToken, refreshToken } =
      await this.authService.createAccessTokenRefreshToken(user_id);

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      mbti,
    };
  }

  @UseGuards(KakaoAuthGuard)
  @Get('auth/kakao')
  async kakaoLogin() {
    return HttpStatus.OK;
  }

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

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/logout')
  async logout(@Req() req) {
    const { refreshToken } = req.user;

    await this.authService.deleteRefreshToken(refreshToken);

    return { message: '로그아웃 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/feeds/:feedId/pick')
  async pickedFeed(@Req() req, @Param('feedId', ParseIntPipe) feed_id: number) {
    const user_id = req.user;

    // 합쳐지면 feed service 확인 후 존재하는 게시물인지
    // 확인하는 로직 추가

    const chkPicked = await this.userService.chkPicked(user_id, feed_id);

    if (!chkPicked) {
      return { message: '찜하기가 취소되었습니다.' };
    }

    return { message: '찜목록에 추가되었습니다.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit')
  async updatedProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user_id = req.user;
    console.log(typeof user_id);

    await this.userService.updatedProfile(user_id, updateUserDto);

    return { message: '프로필 수정 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/mypage')
  async myPage(@Req() req) {
    const user_id = req.user;

    return this.userService.getMypageInfo(user_id);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh-token')
  async reIssue(@Req() req) {
    const { user_id } = req.user;
    const newAccessToken = await this.authService.createAccessToken({
      user_id,
    });

    return {
      accessToken: `Bearer ${newAccessToken}`,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-group-list')
  async getMyGroupList(@Req() req) {
    const userId = req.user;
    return await this.userService.getMyGroupList(userId);
  }

  // 유저 피드 조회
  @ApiOperation({ summary: '유저 피드 조회' })
  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/my-feed')
  getUserFeed(@Req() req) {
    const user_id = req.user;
    return this.userService.getUserFeed(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/my-pick')
  getUserPick(@Req() req) {
    const user_id = req.user;
    return this.userService.getUserPick(user_id);
  }
}
