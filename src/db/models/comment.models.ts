import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import { User } from './user.models';
import { Feed } from './feed.models';
@Table({
  modelName: 'Comment',
  tableName: 'comments',
  freezeTableName: false,
  timestamps: true,
})
export class Comment extends Model {
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Feed)
  feed: Feed;

  @BelongsTo(() => Comment)
  comment: Comment;

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  comment_id: number;

  @ForeignKey(() => Comment)
  @AllowNull(false)
  @Column
  parent_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id: number;

  @ForeignKey(() => Feed)
  @AllowNull(false)
  @Column
  feed_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
