import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { LocalUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async createUser(localUser: LocalUserDto): Promise<User> {
    try {
      const { loginId, password, nickName, platformType, mbti } = localUser;
      return await this.userModel.create({
        loginId,
        password,
        nickName,
        platformType,
        mbti,
      });
    } catch (error) {
      return error.message;
    }
  }

  async findUserById(login_id: string): Promise<User> {
    return this.userModel.findOne({ raw: true, where: { login_id } });
  }

  /*
   * 컬럼명을 매개변수로 받아
   * 동적으로 해당 컬럼에 중복 데이터가 있는지 확인
   */
  async IsDuplicatedInputData(column: string, data: string): Promise<User> {
    try {
      return this.userModel.findOne({ where: { [column]: data } });
    } catch (error) {
      return error.message;
    }
  }
}
