import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Unique,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Feed } from './feed.models';
import { User } from './user.models';

@Table({
  modelName: 'Pick',
  tableName: 'picks',
  freezeTableName: false,
  timestamps: true,
})
export class Pick extends Model {
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Feed)
  feed: Feed;

  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Unique
  @Column
  pick_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id: number;

  @ForeignKey(() => Feed)
  @AllowNull(false)
  @Column
  Feed: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
