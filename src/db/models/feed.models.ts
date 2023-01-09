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
import { Group } from './group.models';
@Table({
  modelName: 'Feed',
  freezeTableName: true,
  timestamps: true,
})
export class Feed extends Model {
  @HasMany(() => Comment)
  Comment: Comment[];

  @HasMany(() => Like)
  Like: Like[];

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Group)
  group: Group;

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  feedId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @ForeignKey(() => Group)
  @AllowNull(false)
  @Column
  groupId: number;

  @Column
  thumbnail: string;

  @Column
  @AllowNull(false)
  title: string;

  @Column
  @AllowNull(false)
  description: string;

  @Column
  @AllowNull(false)
  location: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
