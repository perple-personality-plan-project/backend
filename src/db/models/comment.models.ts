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
import { Feed } from './feed.models';
import { Group } from './group.models';
@Table({
  modelName: 'Comment',
  freezeTableName: true,
  timestamps: true,
})
export class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  commentId: number;

  @ForeignKey(() => Comment)
  @AllowNull(false)
  @Column
  parentId: number;

  @BelongsTo(() => Comment)
  comment: Comment;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Feed)
  @AllowNull(false)
  @Column
  feedId: number;

  @BelongsTo(() => Feed)
  feed: Feed;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
