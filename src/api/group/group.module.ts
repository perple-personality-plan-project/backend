import { Module } from '@nestjs/common';
import { GroupService } from './service/group.service';
import { GroupController } from './controller/group.controller';

@Module({
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
