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

@Module({
  imports: [
    SequelizeModule.forFeature([Group, GroupUser, GroupHashtag, Hashtag, Map]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
