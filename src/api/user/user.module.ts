import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { Feed } from 'src/db/models/feed.models';
import { Like } from 'src/db/models/like.models';
import { UserRepository } from './user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Pick } from '../../db/models/pick.models';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Pick, Feed, Like]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, AuthService, UserRepository, JwtService],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
