import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRepository } from '../../group/group.repository';
import { CommentRepository } from '../../comment/comment.repository';

@Injectable()
export class GroupCommentService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createGroupComment(comment, group_id, feed_id, user_id) {
    const groupUser = {
      ...group_id,
      ...user_id,
    };

    const isGroupUser = await this.groupRepository.findGroupUser(groupUser);

    if (!isGroupUser) {
      throw new BadRequestException('구독 되지 않은 유저 입니다.');
    }

    await this.commentRepository.createComment(comment, user_id, feed_id);

    return '댓글이 작성 되었습니다.';
  }

  async deleteGroupComment(group_id, feed_id, comment_id, user_id) {
    const isComment = await this.commentRepository.findComment(comment_id);

    if (!isComment) {
      throw new BadRequestException('존재하지 않는 게시글 입니다.');
    }

    if (isComment.user_id !== user_id.user_id) {
      throw new BadRequestException('본인 게시글만 삭제 가능합니다.');
    }

    const deleteComment = await this.commentRepository.deleteComment(
      user_id,
      comment_id,
    );

    if (deleteComment) {
      return `댓글이 삭제 되었습니다.`;
    }
  }
}
