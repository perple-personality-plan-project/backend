import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  HasMany,
  AllowNull,
  Unique,
  AutoIncrement,
} from 'sequelize-typescript';
import { Group } from './group.models';
import { Like } from './like.models';
import { Feed } from './feed.models';
import { Follower } from './follower.models';
import { Comment } from './comment.models';

@Table({
  modelName: 'User',
  freezeTableName: true,
  timestamps: true,
})
export class User extends Model {
  //HasMany
  @HasMany(() => Group)
  group: Group[];

  @HasMany(() => Like)
  like: Like[];

  @HasMany(() => Feed)
  feed: Feed[];

  @HasMany(() => Follower)
  follower: Follower[];

  @HasMany(() => Comment)
  comment: Comment[];

  //belong to

  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Unique
  @Column
  userId: number;

  @Column
  @AllowNull(false)
  @Unique
  loginId: string;

  @Column
  @AllowNull(false)
  password: string;

  @Column
  @AllowNull(false)
  nickName: string;

  @Column
  mbti: string;

  @Column
  platformType: string;

  @Column
  pick: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
