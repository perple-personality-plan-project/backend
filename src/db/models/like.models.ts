import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  AllowNull,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user.models';
import { Feed } from './feed.models';
@Table({
  modelName: 'Like',
  tableName: 'likes',
  freezeTableName: false,
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
  like_id: number;

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
