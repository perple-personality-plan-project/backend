import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Unique,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.models';

@Table({
  modelName: 'Map',
  tableName: 'maps',
  freezeTableName: false,
  timestamps: true,
})
export class Map extends Model {
  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Unique
  @Column
  map_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id: number;

  @AllowNull(false)
  @Column
  place_group: string;

  @AllowNull(false)
  @Column
  place_group_name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
