import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo, AllowNull, AutoIncrement,
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
  @AllowNull(false)
  @AutoIncrement
  @Column
  likeId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @ForeignKey(() => Feed)
  @AllowNull(false)
  @Column
  feedId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
