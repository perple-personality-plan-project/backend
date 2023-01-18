import { Module } from '@nestjs/common';
import { GroupCommentController } from './controller/group.comment.controller';
import { GroupCommentService } from './service/group.comment.service';
import { GroupRepository } from '../group/group.repository';
import { CommentRepository } from '../comment/comment.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../../db/models/group.models';
import { GroupUser } from '../../db/models/groupUser.models';
import { GroupHashtag } from '../../db/models/groupHahtag.models';
import { Hashtag } from '../../db/models/hashtag.models';
import { Map } from '../../db/models/map.models';
import { Feed } from '../../db/models/feed.models';
import { User } from '../../db/models/user.models';
import { Like } from '../../db/models/like.models';
import { Comment } from '../../db/models/comment.models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Group,
      GroupUser,
      GroupHashtag,
      Hashtag,
      Map,
      Feed,
      User,
      Like,
      Comment,
    ]),
  ],
  controllers: [GroupCommentController],
  providers: [GroupCommentService, GroupRepository, CommentRepository],
})
export class GroupCommentModule {}
