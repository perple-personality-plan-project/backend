import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import { User } from './user.models';

@Table({
  modelName: 'Follower',
  freezeTableName: true,
  timestamps: true,
})
export class Follower extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  followerId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  touserId: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  fromuserId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
