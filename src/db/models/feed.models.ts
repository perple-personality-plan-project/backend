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

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  feed_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id: number;

  @Column
  thumbnail: string;

  @Column
  group_name: string;

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
