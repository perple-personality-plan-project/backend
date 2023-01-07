import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'Follower',
  freezeTableName: true,
  timestamps: true,
})
export class Follower extends Model {
  @PrimaryKey
  @Column
  followerId: number;

  @Column
  touserId: number;

  @Column
  fromuserId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
