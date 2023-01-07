import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.models';
import { Feed } from './feed.models';
@Table({
  modelName: 'Comment',
  freezeTableName: true,
  timestamps: true,
})
export class Comment extends Model {
  @BelongsTo(() => Feed)
  feed: Feed;

  @PrimaryKey
  @Column
  commentId: number;

  @ForeignKey(() => Comment)
  @Column
  parentId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Feed)
  @Column
  feedId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
