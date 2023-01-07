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
  modelName: 'Like',
  freezeTableName: true,
  timestamps: true,
})
export class Like extends Model {
  @BelongsTo(() => Feed)
  feed: Feed;
  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @Column
  likeId: number;

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
