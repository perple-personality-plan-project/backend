import { Module } from '@nestjs/common';
import { GroupService } from './service/group.service';
import { GroupController } from './controller/group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/db/models/group.models';
import { GroupHashtag } from 'src/db/models/groupHahtag.models';
import { Hashtag } from 'src/db/models/hashtag.models';
import { GroupUser } from 'src/db/models/groupUser.models';

@Module({
  imports: [
    SequelizeModule.forFeature([Group, GroupUser, GroupHashtag, Hashtag]),
  ],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
