import { Injectable } from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { Like } from 'src/db/models/like.models';
import { FeedRequestDto } from '../dto/feed.request.dto';
import { FeedRepository } from '../feed.repository';
import { map } from 'rxjs/operators';
import { AwsS3Service } from '../../../common/utils/asw.s3.service';
@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async createFeed(
    body: FeedRequestDto,
    user_id: number,
    files: Array<Express.Multer.File>,
  ) {
    const imageList = [];
    if (files) {
      const uploadImage = await this.awsS3Service.uploadFileToS3(files);
      uploadImage.map((data) => {
        const key = data['key'].split('/');
        imageList.push(key[1]);
      });
    } else {
      //디폴트 이미지로 바꿔 줘야함!
      imageList.push('');
    }
    body['thumbnail'] = imageList.join(',');

    console.log(user_id);
    const feed = await this.feedRepository.createFeed(body, user_id);

    if (feed) {
      return '피드가 생성 되었습니다.';
    }
  }

  async getAllFeed(userId) {
    const { user_id } = userId;

    return this.feedRepository.getAllFeed(user_id);
  }

  async findFeedById(feed_id, userId) {
    const { user_id } = userId;
    return this.feedRepository.findFeedById(feed_id, user_id);
  }

  async deleteFeed(feed_id, user_id) {
    return this.feedRepository.deleteFeed(feed_id, user_id);
  }

  async checkFeedLike(feed_id, user_id) {
    const isFeedLike = await this.feedRepository.checkFeedLike(
      feed_id,
      user_id,
    );

    if (!isFeedLike) {
      await this.feedRepository.createFeedLike(feed_id, user_id);
      return false;
    } else {
      await this.feedRepository.deleteFeedLike(feed_id, user_id);
      return true;
    }
  }

  async checkPicked(user_id: number, feed_id: number): Promise<boolean> {
    return this.feedRepository.checkPicked(user_id, feed_id);
  }

  async getFeedMbti(mbti, userId) {
    const { user_id } = userId;
    return this.feedRepository.getFeedMbti(mbti, user_id);
  }

  async getLikeCheck(feed_id, user_id) {
    const isFeedLike = await this.feedRepository.checkFeedLike(
      feed_id,
      user_id,
    );

    return isFeedLike ? true : false;
  }
}
