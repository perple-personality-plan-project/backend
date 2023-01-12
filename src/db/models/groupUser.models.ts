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
  tableName: 'group_users',
  freezeTableName: false,
  timestamps: true,
})
export class GroupUser extends Model {
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Group)
  group: Group;

  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column
  group_user_id: number;

  @ForeignKey(() => Group)
  @AllowNull(false)
  @Column
  group_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id: number;

  @AllowNull(false)
  @Column
  admin_flag: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
