import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(): Promise<void> {
    this.userModel.create({
      loginId: 'test',
      nickname: 'test',
      password: '1234',
      mbti: 'INTP',
      platformType: 'platter',
      pick: null,
    });
  }

  async finAll(): Promise<User[]> {
    return this.userModel.findAll({});
  }
}
