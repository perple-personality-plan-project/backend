import { Injectable } from '@nestjs/common';
import { FeedRequestDto } from '../dto/feed.request.dto';
import { FeedRepository } from '../feed.repository';

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  async createFeed(body: FeedRequestDto, userId: object) {
    const createFeed = await this.feedRepository.createFeed(body, userId);
    if (createFeed) {
      return '피드가 생성 되었습니다.';
    }
  }
}
