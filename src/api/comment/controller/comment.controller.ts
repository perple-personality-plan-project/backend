import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { CommentService } from '../service/comment.service';
import { CommentRequestDto } from '../dto/comment.request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comment')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/:feed_id')
  async createComment(
    @Req() req,
    @Param('feed_id') feed_id,
    @Body()
    body: CommentRequestDto,
  ) {
    const user_id = req.user as number;

    return this.commentService.createComment(user_id, feed_id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:feed_id/:comment_id')
  deleteComment(
    @Param('feed_id') feed_id,
    @Param('comment_id') comment_id,
    @Req() req,
  ) {
    const user_id = req.user;
    return this.commentService.deleteComment(comment_id, user_id);
  }
}
