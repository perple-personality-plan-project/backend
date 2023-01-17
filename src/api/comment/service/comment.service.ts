import { Injectable } from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { CommentRepository } from '../comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(body, user_id, req) {
    const newComment = await this.commentRepository.createComment(
      body,
      user_id,
      req,
    );

    return this.commentRepository.findComment(newComment.comment_id);
  }
}
