import { Injectable } from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { Like } from 'src/db/models/like.models';
import { FeedRequestDto } from '../dto/feed.request.dto';
import { FeedRepository } from '../feed.repository';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async createFeed(body: FeedRequestDto, user_id: object) {
    const feed = await this.feedRepository.createFeed(body, user_id);
    if (feed) {
      return '피드가 생성 되었습니다.';
    }
  }

  async getAllFeed() {
    return this.feedRepository.getAllFeed();
  }

  async findFeedById(feed_id) {
    return this.feedRepository.findFeedById(feed_id);
  }
}
// async uploadImg(cat: Cat, files: Express.Multer.File[]) {
//     const fileName = `cats/${files[0].filename}`;

//     console.log(fileName);

//     const newCat = await this.catsRepository.findByIdAndUpdateImg(
//       cat.id,
//       fileName,
//     );
//     console.log(newCat);
//     return newCat;
//   }
