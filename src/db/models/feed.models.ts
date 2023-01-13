import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  HasMany,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import { User } from './user.models';
import { Comment } from './comment.models';
import { Like } from './like.models';
import { GroupUser } from './groupUser.models';

@Table({
  modelName: 'Feed',
  tableName: 'feeds',
  freezeTableName: false,
  timestamps: true,
})
export class Feed extends Model {
  @HasMany(() => Comment)
  Comment: Comment[];

  @HasMany(() => Like)
  Like: Like[];

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => GroupUser)
  groupUser: GroupUser;

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  feed_id: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column
  user_id: number;

  @ForeignKey(() => GroupUser)
  @AllowNull(true)
  @Column
  group_user_id: number;

  @Column
  thumbnail: string;

  @AllowNull(false)
  @Column
  description: string;

  @Column
  location: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
