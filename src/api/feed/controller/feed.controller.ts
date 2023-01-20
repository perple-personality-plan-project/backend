import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
  Param,
  Delete,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { FeedRequestDto } from '../dto/feed.request.dto';
import { FeedService } from '../service/feed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { request } from 'http';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('feed')
@ApiTags('feed')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiOperation({ summary: 'mbti별 피드 조회' })
  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @Get('/search')
  async getFeedMbti(@Query('mbti') mbti: string) {
    return this.feedService.getFeedMbti(mbti);
  }

  @ApiOperation({ summary: '피드 생성' })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: FeedRequestDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 412,
    description: 'description는 필수값 입니다',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FilesInterceptor('thumbnail', 5))
  async createFeed(
    @Body() body: FeedRequestDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    const user_id = req.user;
    console.log(user_id);
    return this.feedService.createFeed(body, user_id, files);
  }

  @ApiOperation({ summary: '전체 피드 조회' })
  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @Get()
  getAllFeed() {
    return this.feedService.getAllFeed();
  }

  @ApiOperation({ summary: '피드 상세조회' })
  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @Get('/:feed_id')
  findFeedById(@Param('feed_id') feed_id) {
    return this.feedService.findFeedById(feed_id);
  }

  @ApiOperation({ summary: '피드 삭제' })
  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:feed_id')
  deleteFeed(@Param('feed_id') feed_id, @Req() req) {
    const user_id = req.user;
    return this.feedService.deleteFeed(feed_id, user_id);
  }

  @ApiOperation({ summary: '피드 좋아요' })
  @ApiResponse({
    status: 200,
    description: '성공!',
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put('/:feed_id/like')
  async createFeedLike(@Param('feed_id') feed_id, @Req() req) {
    const user_id = req.user;
    const isFeedLike = await this.feedService.checkFeedLike(feed_id, user_id);

    if (isFeedLike) {
      return '좋아요를 취소했습니다.';
    }
    return '좋아요 했습니다.';
  }
}
