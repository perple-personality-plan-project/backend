import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pick } from 'src/db/models/pick.models';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Pick)
    private pickModel: typeof Pick,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const { login_id, password, nickname, provider, mbti } = user;
      return await this.userModel.create({
        login_id,
        password,
        nickname,
        provider,
        mbti,
      });
    } catch (error) {
      return error.message;
    }
  }

  async findUserByLoginId(login_id: string): Promise<User> {
    return this.userModel.findOne({ raw: true, where: { login_id } });
  }

  async findUserByUserId(user_id: number): Promise<User> {
    return this.userModel.findOne({ raw: true, where: { user_id } });
  }

  async chkPicked(user_id: number, feed_id: number) {
    const [_, isPicked] = await this.pickModel.findOrCreate({
      where: { user_id, feed_id },
      defaults: { user_id, feed_id },
    });

    if (!isPicked) {
      await this.pickModel.destroy({ where: { user_id, feed_id } });
    }

    return isPicked;
  }

  async updatedProfile(user_id: number, body: object) {
    console.log(body);
    return this.userModel.update({ ...body }, { where: { user_id } });
  }

  /*
   * 컬럼명을 매개변수로 받아
   * 동적으로 해당 컬럼에 중복 데이터가 있는지 확인
   */
  async IsDuplicatedInputData(column: string, data: string): Promise<User> {
    try {
      const test = await this.userModel.findOne({ where: { [column]: data } });
      console.log(test);
      return test;
    } catch (error) {
      return error.message;
    }
  }
}
