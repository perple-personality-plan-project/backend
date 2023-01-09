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
  Unique,
} from 'sequelize-typescript';
import { User } from './user.models';
import { GroupHashtag } from './groupHahtag.models';
import { GroupUser } from './groupUser.models';

@Table({
  modelName: 'Group',
  freezeTableName: true,
  timestamps: true,
})
export class Group extends Model {
  @HasMany(() => GroupHashtag)
  groupHashtag: GroupHashtag[];

  @HasMany(() => GroupUser)
  groupUser: GroupUser[];

  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @AutoIncrement
  @Column
  groupId: number;

  @Column
  @AllowNull(false)
  @Unique
  groupname: string;

  @Column
  @AllowNull(false)
  thumbnail: string;

  @Column
  @AllowNull(false)
  description: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
