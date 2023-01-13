import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  HasMany,
  AutoIncrement,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import { GroupHashtag } from './groupHahtag.models';
import { GroupUser } from './groupUser.models';

@Table({
  modelName: 'Group',
  tableName: 'groups',
  freezeTableName: false,
  timestamps: true,
})
export class Group extends Model {
  @HasMany(() => GroupHashtag)
  groupHashTag: GroupHashtag[];

  @HasMany(() => GroupUser)
  groupUser: GroupUser[];

  @PrimaryKey
  @AutoIncrement
  @Column
  group_id: number;

  @AllowNull(false)
  @Unique
  @Column
  group_name: string;

  @AllowNull(false)
  @Column
  thumbnail: string;

  @AllowNull(false)
  @Column
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
