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
  @AllowNull(false)
  @AutoIncrement
  @Column
  groupUserId: number;

  @ForeignKey(() => Group)
  @AllowNull(false)
  @Column
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @AllowNull(false)
  @Column
  isGroupUser: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @AllowNull(false)
  @Column
  isAdmin: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
