import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
  Param,
  Query,
  Put,
  ParseIntPipe,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { GroupParamDto, GroupRequestDto } from '../dto/group.request.dto';
import { GroupService } from '../service/group.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Request } from 'express';
import { PositiveIntPipe } from '../../../common/pipes/positiveInt.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('group')
@ApiTags('group')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '전체 그룹 리스트 가져오기' })
  @Get()
  async getGroup(@Query() req: GroupParamDto) {
    return this.groupService.getGroup(req);
  }

  @ApiOperation({ summary: '그룹 만들기' })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: GroupRequestDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 412,
    description: 'groupname or description는 필수값 입니다',
  })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('thumbnail', 5))
  async createGroup(
    @Body() body: GroupRequestDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    const userId = { user_id: req.user };
    return this.groupService.createGroup(body, userId, files);
  }

  @Put('/:groupId')
  async signUpGroup(@Param() req) {
    const user_id = { user_id: 2 };
    return this.groupService.groupSignUp(user_id, req);
  }

  @Get('/:groupId')
  async getSubscription(@Param() req) {
    const user_id = { user_id: 2 };
    return this.groupService.getSubscription(user_id, req);
  }

  @Get('/:groupId/feed')
  async getGroupFeed(
    @Param('groupId', ParseIntPipe, PositiveIntPipe) req: number,
  ) {
    return this.groupService.getGroupFeed(req);
  }

  @Get('/:groupId/feed/:feedId')
  async getGroupFeedDetail(
    @Param('groupId', ParseIntPipe, PositiveIntPipe) groupId: number,
    @Param('feedId', ParseIntPipe, PositiveIntPipe) feedId: number,
  ) {
    return this.groupService.getGroupFeedDetail(groupId, feedId);
  }

  @Post('/:groupId/feed/')
  @UseInterceptors(FilesInterceptor('thumbnail', 5))
  async createGroupFeed(
    @Body() body,
    @Param() group_id,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const userId = { user_id: 2 };
    return this.groupService.createGroupFeed(body, group_id, userId, files);
  }

  @Put('/:group_id/feed/:feed_id/like')
  async groupFeedLike(
    @Param('group_id', ParseIntPipe, PositiveIntPipe) group_id: number,
    @Param('feed_id', ParseIntPipe, PositiveIntPipe) feed_id: number,
  ) {
    const userId = { user_id: 2 };
    return this.groupService.groupFeedLike(userId, group_id, feed_id);
  }
}
