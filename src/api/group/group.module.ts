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
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
