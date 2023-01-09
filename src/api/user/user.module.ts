import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Follower } from 'src/db/models/follower.models';

@Module({
  imports: [SequelizeModule.forFeature([User, Follower])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
