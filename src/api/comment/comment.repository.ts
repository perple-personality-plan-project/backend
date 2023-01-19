import { Injectable } from '@nestjs/common';
import { Feed } from '../../db/models/feed.models';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Comment } from 'src/db/models/comment.models';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Feed)
    private feedModel: typeof Feed,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Comment)
    private commentModel: typeof Comment,
  ) {}

  async findComment(comment_id) {
    return this.commentModel.findOne({
      raw: true,
      where: { comment_id },
      attributes: [
        'comment_id',
        'user_id',
        'feed_id',
        [Sequelize.col('user.nickname'), 'nickanme'],
        'comment',
        'updated_at',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
        },
      ],
    });
  }

  async createComment(user_id: number, feed_id: number, body: object) {
    return this.commentModel.create({ user_id, feed_id, ...body });
  }

  async deleteComment(comment_id, user_id) {
    return this.commentModel.destroy({
      where: { comment_id, user_id },
    });
  }
}
