import { Injectable } from '@nestjs/common';
import { Feed } from '../../db/models/feed.models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FeedRepository {
  constructor(
    @InjectModel(Feed)
    private feedModel: typeof Feed,
  ) {}

  async createFeed(body, userId) {
    return this.feedModel.create({ ...body, ...userId });
  }

  async findFeed(findData: object) {
    return this.feedModel.findOne({
      raw: true,
      where: { ...findData },
    });
  }

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const feedImg = await this.userModel.findById(id);

    feedImg.imgUrl = `http://localhost:8000/media/${fileName}`;

    const newFeedImg = await feedImg.save();

    console.log(newFeedImg);
    return newFeedImg.readOnlyData;
  }
}
