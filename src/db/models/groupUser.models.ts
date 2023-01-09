import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './user.models';
import { Group } from './group.models';

@Table({
  modelName: 'GroupUser',
  freezeTableName: true,
  timestamps: true,
})
export class GroupUser extends Model {
  @PrimaryKey
  @Column
  @AllowNull(false)
  @AutoIncrement
  groupUserId: number;

  @ForeignKey(() => Group)
  @Column
  @AllowNull(false)
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @Column
  @AllowNull(false)
  isGroupUser: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  @AllowNull(false)
  isAdmin: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
