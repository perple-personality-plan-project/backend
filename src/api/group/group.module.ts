import { Module } from '@nestjs/common';
import { GroupService } from './service/group.service';
import { GroupController } from './controller/group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/db/models/group.models';
import { GroupHashtag } from 'src/db/models/groupHahtag.models';
import { Hashtag } from 'src/db/models/hashtag.models';
import { GroupUser } from 'src/db/models/groupUser.models';
import { Map } from 'src/db/models/map.models';
import { GroupRepository } from './group.repository';
import { Feed } from '../../db/models/feed.models';
import { User } from '../../db/models/user.models';
import { Like } from '../../db/models/like.models';
import { Comment } from '../../db/models/comment.models';
import { AwsS3Service } from '../../common/utils/asw.s3.service';
import { CommentRepository } from '../comment/comment.repository';
import { FeedRepository } from '../feed/feed.repository';
import { Pick } from '../../db/models/pick.models';

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
      Pick,
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, FeedRepository, AwsS3Service],
  exports: [GroupService, GroupRepository, FeedRepository],
})
export class GroupModule {}
