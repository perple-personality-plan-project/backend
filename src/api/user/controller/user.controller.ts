import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
  Patch,
  Query,
  UploadedFiles,
  NotFoundException,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { UserService } from 'src/api/user/service/user.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { KakaoAuthGuard } from 'src/auth/kakao/kaka-auth.guard';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Group } from 'src/db/models/group.models';
import { Feed } from 'src/db/models/feed.models';
import { Pick } from 'src/db/models/pick.models';
import { FeedService } from 'src/api/feed/service/feed.service';

@Controller('user')
@UseInterceptors(GlobalResponseInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly feedService: FeedService,
  ) {}

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.userService.signUp(createUserDto);

    return { message: '회원가입에 성공했습니다.' };
  }
  //
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req): Promise<{
    accessToken: string;
    refreshToken: string;
    mbti: string;
    user_id: string;
  }> {
    const user_id = req.user;

    const { mbti } = await this.userService.findUserByUserId(user_id);

    const { accessToken, refreshToken } =
      await this.authService.createAccessTokenRefreshToken(user_id);

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      mbti,
      user_id,
    };
  }

  @UseGuards(KakaoAuthGuard)
  @Get('/auth/kakao')
  async kakaoLogin(
    @Req() req,
    @Query('code') code: string,
  ): Promise<{ accessToken: string; refreshToken: string; user_id: number }> {
    const { accessToken, refreshToken, user_id } = req.user;

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      user_id,
    };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/logout')
  async logout(@Req() req): Promise<{ message: string }> {
    const { refreshToken } = req.user;

    await this.authService.deleteRefreshToken(refreshToken);

    return { message: '로그아웃 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/feeds/:feedId/pick')
  async pickedFeed(
    @Req() req,
    @Param('feedId', ParseIntPipe) feed_id: number,
  ): Promise<{ message: string }> {
    const user_id = req.user;

    // const existsFeed = await this.feedService.findFeedById(feed_id);

    // // Feed 서비스에 예외처리 추가되면 삭제
    // if (!existsFeed) {
    //   throw new NotFoundException('존재하지 않는 게시물입니다.');
    // }

    const chkPicked = await this.userService.checkPicked(user_id, feed_id);

    if (!chkPicked) {
      return { message: '찜하기가 취소되었습니다.' };
    }

    return { message: '찜목록에 추가되었습니다.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/edit')
  async updatedProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    const user_id = req.user;

    await this.userService.updatedProfile(user_id, updateUserDto);

    return { message: '프로필 수정 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/mypage')
  async getMyPage(@Req() req): Promise<object[]> {
    const user_id = req.user;

    return this.userService.getMypageInfo(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-profile')
  @UseInterceptors(FilesInterceptor('profile', 1))
  async updateProfile(
    @Req() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ message: string }> {
    const user_id = req.user;
    await this.userService.updateProfile(user_id, files);
    return { message: '업데이트 성공' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update-background')
  @UseInterceptors(FilesInterceptor('profile', 1))
  async updateBackground(
    @Req() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const user_id = req.user;
    await this.userService.updateBackground(user_id, files);
    return { message: '업데이트 성공' };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh-token')
  async reIssue(@Req() req): Promise<{ accessToken: string }> {
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
  async getMyGroupList(@Req() req): Promise<Group[]> {
    const user_id = req.user;
    return await this.userService.getMyGroupList(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/my-feed')
  getUserFeed(@Req() req): Promise<Feed[]> {
    const user_id = req.user;
    return this.userService.getUserFeed(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/my-pick')
  getUserPick(@Req() req): Promise<Pick[]> {
    const user_id = req.user;
    return this.userService.getUserPick(user_id);
  }
}
