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
  BeforeUpdate,
  BeforeCreate,
  BeforeBulkUpdate,
} from 'sequelize-typescript';
import { Like } from './like.models';
import { Feed } from './feed.models';
import { Comment } from './comment.models';
import { Map } from './map.models';
import { Pick } from './pick.models';
import { GroupUser } from './groupUser.models';
import * as bcrypt from 'bcrypt';

@Table({
  modelName: 'User',
  tableName: 'users',
  freezeTableName: false,
  timestamps: true,
})
export class User extends Model {
  //HasMany
  @HasMany(() => GroupUser)
  groupUser: GroupUser[];

  @HasMany(() => Like)
  like: Like[];

  @HasMany(() => Feed)
  feed: Feed[];

  @HasMany(() => Map)
  map: Map[];

  @HasMany(() => Pick)
  pick: Pick[];

  @HasMany(() => Comment)
  comment: Comment[];

  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Unique
  @Column
  user_id: number;

  @AllowNull(false)
  @Unique
  @Column
  login_id: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Column
  nickname: string;

  @Column
  mbti: string;

  @Column
  provider: string;

  @Column
  profile_img: string;

  @Column
  background_img: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BeforeCreate
  static async hashedPassword(user: User) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  @BeforeCreate
  static mbtiConvertToUpperCaseBeforeCreate(user: User) {
    user.mbti = user.mbti.toUpperCase();
  }

  @BeforeBulkUpdate
  static mbtiConvertToUpperCaseBeforeUpdate(user: User) {
    const { mbti } = user['attributes'];

    if (mbti) {
      user['attributes']['mbti'] = mbti.toUpperCase();
    }
  }
}
