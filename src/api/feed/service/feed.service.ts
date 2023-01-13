import { Injectable } from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { Like } from 'src/db/models/like.models';
import { FeedRequestDto } from '../dto/feed.request.dto';
import { FeedRepository } from '../feed.repository';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async createFeed(body: FeedRequestDto, user_id: object) {
    const createFeed = await this.feedRepository.createFeed(body, user_id);
    if (createFeed) {
      return '피드가 생성 되었습니다.';
    }
  }

  async getAllFeed() {
    const feeds = await this.feedRepository.getAllFeed();

    return feeds.map((feed) => {
      return {
        feed_id: feed.feed_id,
        user_id: feed.user_id,
        thumbnail: feed.thumbnail,
        description: feed.description,
        // mbti: feed.user.mbti,
        // likes: feed.like.length,
        created_at: feed.created_at,
        updated_at: feed.updated_at,
      };
    });
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
