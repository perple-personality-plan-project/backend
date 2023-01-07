import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.models';

@Table({
  modelName: 'GroupUser',
  freezeTableName: true,
  timestamps: true,
})
export class GroupUser extends Model {
  @PrimaryKey
  @Column
  groupUserId: number;

  @Column
  groupId: number;

  @Column
  isGroupUser: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  isAdmin: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
