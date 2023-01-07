import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  modelName: 'User',
  freezeTableName: true,
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Column
  userId: number;

  @Column
  loginId: string;

  @Column
  password: string;

  @Column
  nickname: string;

  @Column
  mbti: string;

  @Column
  platformType: string;

  @Column
  pick: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
