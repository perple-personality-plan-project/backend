import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  HasMany,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import { GroupHashtag } from './groupHahtag.models';

@Table({
  modelName: 'Hashtag',
  tableName: 'hashtags',
  freezeTableName: true,
  timestamps: true,
})
export class Hashtag extends Model {
  @HasMany(() => GroupHashtag)
  groupHashtag: GroupHashtag[];

  @PrimaryKey
  @AutoIncrement
  @Column
  hashtag_id: number;

  @AllowNull(false)
  @Column
  title: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
