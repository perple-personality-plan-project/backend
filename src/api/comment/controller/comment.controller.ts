import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
  Param,
  Delete,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { CommentService } from '../service/comment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentRequestDto } from '../dto/comment.request.dto';

@Controller('comment')
@ApiTags('comment')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @Post('/:feed_id')
  async createComment(
    @Param() req,
    @Body()
    body: CommentRequestDto,
  ) {
    const user_id = { user_id: 3 };

    return this.commentService.createComment(body, req, user_id);
  }
}
