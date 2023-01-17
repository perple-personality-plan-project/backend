import { Module } from '@nestjs/common';
import { CommentService } from './service/comment.service';
import { CommentController } from './controller/comment.controller';
import { Like } from 'src/db/models/like.models';
import { Feed } from 'src/db/models/feed.models';
import { User } from 'src/db/models/user.models';
import { Comment } from 'src/db/models/comment.models';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [SequelizeModule.forFeature([User, Like, Feed, Comment])],

  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
