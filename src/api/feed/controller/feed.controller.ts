import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { FeedRequestDto } from '../dto/feed.request.dto';
import { FeedService } from '../service/feed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('feed')
@ApiTags('feed')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiOperation({ summary: '전체 피드 조회하기' })
  @Get()
  getAllFeed() {
    return this.feedService.getAllFeed();
  }

  @ApiOperation({ summary: '피드 만들기' })
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
    description: 'title or description는 필수값 입니다',
  })
  @Post()
  async createFeed(@Body() body: FeedRequestDto) {
    const user_id = { user_id: 3 };

    return this.feedService.createFeed(body, user_id);
  }

  // @ApiOperation({ summary: '고양이 이미지 업로드' })
  // @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // uploadCatImg(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @CurrentUser() cat: Cat,
  // ) {
  //   return this.catsService.uploadImg(cat, files);
  // }
}
