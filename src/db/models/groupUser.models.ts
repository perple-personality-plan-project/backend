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
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.models';
import { Group } from './group.models';
import { Feed } from './feed.models';

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

  @HasMany(() => Feed)
  feed: Feed[];

  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column
  group_user_id: number;

  @ForeignKey(() => Group)
  @AllowNull(false)
  @Column({
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  group_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user_id: number;

  @AllowNull(false)
  @Column
  admin_flag: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
