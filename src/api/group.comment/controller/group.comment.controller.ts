import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupCommentService } from '../service/group.comment.service';
import { PositiveIntPipe } from '../../../common/pipes/positiveInt.pipe';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Request } from 'express';

@Controller('group-comment')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class GroupCommentController {
  constructor(private readonly groupCommentService: GroupCommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('group/:group_id/feed/:feed_id/')
  async createGroupComment(
    @Body() comment,
    @Param('group_id', ParseIntPipe, PositiveIntPipe) group_id: number,
    @Param('feed_id', ParseIntPipe, PositiveIntPipe) feed_id: number,
    @Req() req: Request,
  ) {
    const userId = { user_id: req.user };
    return this.groupCommentService.createGroupComment(
      comment,
      group_id,
      feed_id,
      userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('group/:group_id/feed/:feed_id/:comment_id')
  async deleteGroupComment(
    @Param('group_id', ParseIntPipe, PositiveIntPipe) group_id: number,
    @Param('feed_id', ParseIntPipe, PositiveIntPipe) feed_id: number,
    @Param('comment_id', ParseIntPipe, PositiveIntPipe) comment_id: number,
    @Req() req: Request,
  ) {
    const userId = { user_id: req.user };
    return this.groupCommentService.deleteGroupComment(
      group_id,
      feed_id,
      comment_id,
      userId,
    );
  }
}
