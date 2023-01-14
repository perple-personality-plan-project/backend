import { Injectable } from '@nestjs/common';
import { Feed } from '../../db/models/feed.models';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Like } from 'src/db/models/like.models';

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
    return this.feedModel.findAll({
      raw: true,
      include: [
        {
          model: this.userModel,
          attributes: {
            exclude: ['user_id', 'mbti'],
          },
        },
        {
          model: this.likeModel,
          attributes: {
            exclude: ['like_id'],
          },
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findFeed(findData: object) {
    return this.feedModel.findOne({
      raw: true,
      where: { ...findData },
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
