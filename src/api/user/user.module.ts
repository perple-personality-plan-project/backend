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
import { GroupRepository } from '../group/group.repository';
import { Group } from '../../db/models/group.models';
import { GroupUser } from '../../db/models/groupUser.models';
import { GroupHashtag } from '../../db/models/groupHahtag.models';
import { Hashtag } from '../../db/models/hashtag.models';
import { Map } from '../../db/models/map.models';
import { Comment } from '../../db/models/comment.models';
import { AwsS3Service } from 'src/common/utils/asw.s3.service';
import { FeedService } from '../feed/service/feed.service';
import { FeedRepository } from '../feed/feed.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Pick,
      Group,
      GroupUser,
      GroupHashtag,
      Hashtag,
      Map,
      Feed,
      Like,
      Comment,
    ]),
    forwardRef(() => AuthModule),
    HttpModule,
  ],
  providers: [
    UserService,
    AuthService,
    FeedService,
    FeedRepository,
    UserRepository,
    JwtService,
    AwsS3Service,
    GroupRepository,
  ],
  controllers: [UserController],
  exports: [UserRepository, UserService],
})
export class UserModule {}
