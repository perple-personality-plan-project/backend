import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Follower } from 'src/db/models/follower.models';
import { UserRepository } from './user.repository';

@Module({
  imports: [SequelizeModule.forFeature([User, Follower])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
