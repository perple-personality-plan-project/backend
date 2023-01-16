import { Injectable } from '@nestjs/common';
import { Feed } from '../../db/models/feed.models';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Like } from 'src/db/models/like.models';
import { Sequelize } from 'sequelize-typescript';
@Injectable()
export class FeedRepository {
  constructor(
    @InjectModel(Feed)
    private feedModel: typeof Feed,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Like)
    private likeModel: typeof Like,
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
    return this.feedModel.findOne({
      raw: true,
      where: { feed_id },
      include: {
        model: Like,
        as: 'like',
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('like.like_id')), 'like_count'],
        ],
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
