import { Injectable } from '@nestjs/common';
import { Feed } from '../../db/models/feed.models';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Like } from 'src/db/models/like.models';
import { Sequelize } from 'sequelize-typescript';
import { Comment } from '../../db/models/comment.models';
import { Op } from 'sequelize';
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
  ) {}

  async createFeed(body, user_id) {
    return this.feedModel.create({ ...body, ...user_id });
  }

  async getAllFeed() {
    const feeds = await this.feedModel.findAll({
      raw: true,
      attributes: [
        'feed_id',
        'thumbnail',
        'description',
        [Sequelize.col('user.user_id'), 'user_id'],
        [Sequelize.col('user.mbti'), 'mbti'],
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
          attributes: [
            [
              Sequelize.fn('COUNT', Sequelize.col('like.like_id')),
              'like_count',
            ],
          ],
        },
      ],
      group: ['feed_id'],
      order: [['created_at', 'DESC']],
    });
    console.log(feeds);
    return feeds;
  }

  async findFeedById(feed_id) {
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
        [Sequelize.col('user.user_id'), 'user_id'],
        'thumbnail',
        'description',
        'location',
        [Sequelize.col('user.nickname'), 'nickname'],
        [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'likeCount'],
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
        [Sequelize.col('user.user_id'), 'user_id'],
        'feed_id',
        'comment',
        [Sequelize.col('user.nickname'), 'nickname'],
        'created_at',
        'updated_at',
      ],
      raw: true,
    });

    feed.comment = commentResult;
    return feed;
  }

  async deleteFeed(feed_id) {
    return this.feedModel.destroy({
      where: { feed_id },
    });
  }

  async getUserFeed(user_id) {
    const feeds = await this.feedModel.findAll({
      raw: true,
      where: { ...user_id },
      attributes: [
        'feed_id',
        'thumbnail',
        'description',
        [Sequelize.col('user.user_id'), 'user_id'],
        [Sequelize.col('user.mbti'), 'mbti'],
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
          attributes: [
            [
              Sequelize.fn('COUNT', Sequelize.col('like.like_id')),
              'like_count',
            ],
          ],
        },
      ],
      group: ['feed_id'],
      order: [['created_at', 'DESC']],
    });
    console.log(feeds);
    return feeds;
  }

  // async findComment(feed_id) {
  //   return this.commentModel.findAll({
  //     raw: true,
  //     where: { feed_id },
  //     attributes: [[Sequelize.col('comment.nickname'), 'nickname']],
  //     include: [
  //       {
  //         model: User,
  //         as: 'user',
  //         attributes: [],
  //       },
  //     ],
  //     order: [['created_at', 'DESC']],
  //   });
  // }

  async checkFeedLike(feed_id, user_id) {
    return this.likeModel.findOne({
      where: {
        [Op.and]: [{ feed_id }, { ...user_id }],
      },
    });
  }

  async createFeedLike(feed_id, user_id) {
    console.log('log3');
    const like = await this.likeModel.create({
      feed_id,
      ...user_id,
    });
    console.log('log4');
    return like;
  }

  async deleteFeedLike(feed_id, user_id) {
    return this.likeModel.destroy({
      where: {
        [Op.and]: [{ feed_id }, { ...user_id }],
      },
    });
  }
}

// async findByIdAndUpdateImg(id: string, fileName: string) {
//   const cat = await this.catModel.findById(id);

//   cat.imgUrl = `http://localhost:8000/media/${fileName}`;

//   const newCat = await cat.save();

//   console.log(newCat);
//   return newCat.readOnlyData;
// }
