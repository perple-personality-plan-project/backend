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
@Module({
  imports: [
    SequelizeModule.forFeature([User, Like, Feed, Comment]),
    MulterModule.register({
      dest: './upload',
    }),
  ],

  controllers: [FeedController],
  providers: [FeedService, FeedRepository],
  exports: [FeedService, FeedRepository],
})
export class FeedModule {}
