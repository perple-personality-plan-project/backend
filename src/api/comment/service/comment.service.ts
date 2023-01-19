import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { CommentRepository } from '../comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(user_id: number, feed_id: number, body: object) {
    return this.commentRepository.createComment(user_id, feed_id, body);
  }

  async deleteComment(comment_id, user_id) {
    const isComment = await this.commentRepository.findComment(comment_id);

    if (!isComment) {
      throw new BadRequestException('존재하지 않는 댓글 입니다.');
    }

    if (isComment.user_id !== user_id) {
      throw new BadRequestException('본인 댓글만 삭제 가능합니다.');
    }
    const deleteComment = await this.commentRepository.deleteComment(
      comment_id,
      user_id,
    );
    if (deleteComment) {
      return `댓글이 삭제 되었습니다.`;
    }
  }
}
