import { Module } from '@nestjs/common';
import { FeedService } from './service/feed.service';
import { FeedController } from './controller/feed.controller';
import { Like } from 'src/db/models/like.models';
import { Feed } from 'src/db/models/feed.models';
import { Comment } from 'src/db/models/comment.models';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Like, Feed, Comment])],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
