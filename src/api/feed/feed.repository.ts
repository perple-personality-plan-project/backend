import { Injectable } from '@nestjs/common';
import { Feed } from '../../db/models/feed.models';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Like } from 'src/db/models/like.models';
import { Sequelize } from 'sequelize-typescript';
import { Comment } from '../../db/models/comment.models';
import { Op } from 'sequelize';
import { Pick } from 'src/db/models/pick.models';
@Injectable()
export class FeedRepository {
  constructor(
    @InjectModel(Feed)
    private feedModel: typeof Feed,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Like)
    private likeModel: typeof Like,
    @InjectModel(Comment)
    private commentModel: typeof Comment,
    @InjectModel(Pick)
    private readonly pickModel: typeof Pick,
  ) {}

  async createFeed(body, user_id) {
    return this.feedModel.create({ ...body, user_id });
  }

  async getAllFeed(user_id: number) {
    const feeds = await this.feedModel.findAll({
      raw: true,
      attributes: [
        'feed_id',
        'thumbnail',
        'description',
        'location',
        [Sequelize.col('user.user_id'), 'user_id'],
        [Sequelize.col('user.nickname'), 'nickname'],
        [Sequelize.col('user.profile_img'), 'profile_img'],
        [Sequelize.col('user.mbti'), 'mbti'],
        [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'likeCount'],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM likes WHERE likes.user_id = ${user_id} AND likes.feed_id = Feed.feed_id)`,
          ),
          'isLike',
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM picks WHERE picks.user_id = ${user_id} AND picks.feed_id = Feed.feed_id)`,
          ),
          'isPick',
        ],
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
        },
        {
          model: Like,
          as: 'like',
          attributes: [],
        },
      ],
      where: { group_user_id: { [Op.eq]: null } },
      group: ['feed_id'],
      order: [['created_at', 'DESC']],
    });

    return feeds;
  }

  async findFeedById(feed_id, user_id) {
    const feed = await this.feedModel.findOne({
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
        },
        { model: Like, as: 'like', attributes: [] },
      ],
      where: {
        feed_id,
      },
      attributes: [
        'feed_id',
        'user_id',
        'thumbnail',
        'description',
        'location',
        [Sequelize.col('user.nickname'), 'nickname'],
        [Sequelize.col('user.profile_img'), 'profile_img'],
        [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'likeCount'],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM likes WHERE likes.user_id = ${user_id} AND likes.feed_id = Feed.feed_id)`,
          ),
          'isLike',
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM picks WHERE picks.user_id = ${user_id} AND picks.feed_id = Feed.feed_id)`,
          ),
          'isPick',
        ],
        'created_at',
        'updated_at',
      ],
      raw: true,
    });

    const commentResult = await this.commentModel.findAll({
      where: { feed_id },
      include: [
        {
          model: User,
          as: 'user',
          required: false,
          attributes: [],
        },
      ],
      attributes: [
        'comment_id',
        'user_id',
        'feed_id',
        'comment',
        [Sequelize.col('user.nickname'), 'nickname'],
        [Sequelize.col('user.profile_img'), 'profile_img'],
        'created_at',
        'updated_at',
      ],
      order: [['created_at', 'DESC']],
      raw: true,
    });

    feed.comment = commentResult;
    return feed;
  }

  async deleteFeed(feed_id, user_id) {
    return this.feedModel.destroy({
      where: { feed_id, user_id },
    });
  }

  async getUserFeed(user_id) {
    const feeds = await this.feedModel.findAll({
      raw: true,
      where: { user_id },
      attributes: [
        'feed_id',
        'thumbnail',
        'description',
        'location',
        [Sequelize.col('user.user_id'), 'user_id'],
        [Sequelize.col('user.mbti'), 'mbti'],
        [Sequelize.col('user.profile_img'), 'profile_img'],
        [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'likeCount'],
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
        },
        {
          model: Like,
          as: 'like',
          attributes: [],
        },
      ],
      group: ['feed_id'],
      order: [['created_at', 'DESC']],
    });
    console.log(feeds);
    return feeds;
  }

  async checkFeedLike(feed_id, user_id) {
    return this.likeModel.findOne({
      where: {
        [Op.and]: [{ feed_id }, { user_id }],
      },
    });
  }

  async createFeedLike(feed_id, user_id) {
    const like = await this.likeModel.create({
      feed_id,
      user_id,
    });

    return like;
  }

  async deleteFeedLike(feed_id, user_id) {
    return this.likeModel.destroy({
      where: {
        [Op.and]: [{ feed_id }, { user_id }],
      },
    });
  }

  async checkPicked(user_id: number, feed_id: number): Promise<boolean> {
    const [_, isPicked] = await this.pickModel.findOrCreate({
      where: { user_id, feed_id },
      defaults: { user_id, feed_id },
    });

    if (!isPicked) {
      await this.pickModel.destroy({ where: { user_id, feed_id } });
    }

    return isPicked;
  }

  async getFeedMbti(mbti, user_id) {
    const feeds = await this.feedModel.findAll({
      raw: true,
      attributes: [
        'feed_id',
        'thumbnail',
        'description',
        'location',
        [Sequelize.col('user.nickname'), 'nickname'],
        [Sequelize.col('user.user_id'), 'user_id'],
        [Sequelize.col('user.mbti'), 'mbti'],
        [Sequelize.col('user.profile_img'), 'profile_img'],
        [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'likeCount'],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM likes WHERE likes.user_id = ${user_id} AND likes.feed_id = Feed.feed_id)`,
          ),
          'isLike',
        ],
        [
          Sequelize.literal(
            `(SELECT COUNT(*) FROM picks WHERE picks.user_id = ${user_id} AND picks.feed_id = Feed.feed_id)`,
          ),
          'isPick',
        ],
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: User,
          as: 'user',
          where: {
            mbti,
          },
          attributes: [],
        },
        {
          model: Like,
          as: 'like',
          attributes: [],
        },
      ],

      group: ['feed_id'],
      order: [['created_at', 'DESC']],
    });

    return feeds;
  }

  async getGroupFeed(groupUserId, feedId) {
    return this.feedModel.findOne({
      where: { feed_id: feedId },
      raw: true,
    });
  }

  async deleteGroupFeed(feedId) {
    return this.feedModel.destroy({ where: { feed_id: feedId } });
  }
}
