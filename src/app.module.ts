import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Logger,
} from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { FeedModule } from './api/feed/feed.module';
import { GroupModule } from './api/group/group.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './api/comment/comment.module';
import { GroupCommentModule } from './api/group.comment/group.comment.module';
import { MapModule } from './api/map/map.module';
import * as redisStore from 'cache-manager-ioredis';
import { LoggerMiddleware } from './common/middlewares/logger.meddleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    FeedModule,
    GroupModule,
    GroupCommentModule,
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_SCHEMA,
      autoLoadModels: true,
      synchronize: false,
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      isGlobal: true,
    }),
    CommentModule,
    GroupCommentModule,
    MapModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
