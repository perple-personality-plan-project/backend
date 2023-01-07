import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import {Group} from "./group.models";

@Table({
  modelName: 'User',
  freezeTableName: true,
  timestamps: true,
})
export class User extends Model {

  @HasMany(() => Group)
  group: Group[];

  @PrimaryKey
  @Column
  userId: number;

  @Column
  loginId: string;

  @Column
  password: string;

  @Column
  nickName: string;

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
