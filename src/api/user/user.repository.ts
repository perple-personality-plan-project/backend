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

  async duplicatedLoginId(loginId: string): Promise<boolean> {
    try {
      const isDupLoginId = await this.userModel.findOne({ where: { loginId } });

      if (isDupLoginId) {
        return true;
      }

      return false;
    } catch (error) {
      return error.message;
    }
  }

  async duplicatedNickname(nickName: string): Promise<boolean> {
    try {
      const isDupNickname = await this.userModel.findOne({
        where: { nickName },
      });

      if (isDupNickname) {
        return true;
      }

      return false;
    } catch (error) {
      return error.message;
    }
  }
}
