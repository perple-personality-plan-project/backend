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
  @Column
  feedId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @Column
  thumbnail: string;

  @Column
  title: string;

  @Column
  description: string;

  @Column
  location: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
