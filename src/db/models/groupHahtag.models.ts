import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Group } from './group.models';
import { Hashtag } from './hashtag.models';

@Table({
  modelName: 'GroupHashtag',
  tableName: 'group_hashtags',
  freezeTableName: false,
  timestamps: true,
})
export class GroupHashtag extends Model {
  @BelongsTo(() => Group)
  group: Group;

  @BelongsTo(() => Hashtag)
  hashtag: Hashtag;

  @PrimaryKey
  @AutoIncrement
  @Column
  group_hashtag_id: number;

  @ForeignKey(() => Group)
  @AllowNull(false)
  @Column
  group_id: number;

  @ForeignKey(() => Hashtag)
  @AllowNull(false)
  @Column
  hashtag_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
