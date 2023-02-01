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
import {
  CreateUserDto,
  LoginIdDto,
  NicknameDto,
  // LoginIdDto,
  // NicknameDto,
} from '../dto/request/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { KakaoAuthGuard } from 'src/auth/kakao/kaka-auth.guard';
import { UpdateMbtiDto, UpdateUserDto } from '../dto/request/update-user.dto';
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
    console.log(createUserDto);
    await this.userService.signUp(createUserDto);

    return { message: '회원가입에 성공했습니다.' };
  }

  @Post('check-id')
  async checkEmail(@Body() loginIdDto: LoginIdDto) {
    await this.userService.IsDuplicatedLoginId(loginIdDto);
    return { message: '사용가능한 아이디입니다.' };
  }

  @Post('check-nick')
  async checkNickname(@Body() nicknameDto: NicknameDto) {
    await this.userService.IsDuplicatedNickname(nicknameDto);
    return { message: '사용가능한 닉네임입니다.' };
  }

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
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user_id: number;
    mbti: string;
  }> {
    const { accessToken, refreshToken, user_id, mbti } = req.user;

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
      user_id,
      mbti,
    };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/logout')
  async logout(@Req() req): Promise<{ message: string }> {
    const user_id = req.user;

    await this.authService.deleteRefreshToken(user_id);

    return { message: '로그아웃 성공' };
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

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-mbti')
  async updateMbti(
    @Req() req,
    @Body(ValidationPipe) updateMbtiDto: UpdateMbtiDto,
  ) {
    const user_id = req.user;

    await this.userService.updateMbti(user_id, updateMbtiDto);

    const user = await this.userService.findUserByUserId(user_id);

    return { mbti: user.mbti };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh-token')
  async reIssue(@Req() req): Promise<{ accessToken: string }> {
    const user_id = req.user;
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
