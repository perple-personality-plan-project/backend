import { Module } from '@nestjs/common';
import { FeedService } from './service/feed.service';
import { FeedController } from './controller/feed.controller';
import { Like } from 'src/db/models/like.models';
import { Feed } from 'src/db/models/feed.models';
import { User } from 'src/db/models/user.models';
import { Comment } from 'src/db/models/comment.models';
import { SequelizeModule } from '@nestjs/sequelize';
import { FeedRepository } from './feed.repository';
import { MulterModule } from '@nestjs/platform-express';
import { AwsS3Service } from '../../common/utils/asw.s3.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Like, Feed, Comment])],

  controllers: [FeedController],
  providers: [FeedService, FeedRepository, AwsS3Service],
  exports: [FeedService, FeedRepository],
})
export class FeedModule {}
