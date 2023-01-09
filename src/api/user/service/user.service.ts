import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from '../dto/create.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const isDupLoginId = await this.duplicatedLoginId(createUserDto.loginId);

    if (isDupLoginId) {
      throw new ConflictException('중복되는 아이디가 존재합니다.');
    }

    const isDupNickname = await this.duplicatedNickname(createUserDto.nickname);

    if (isDupNickname) {
      throw new ConflictException('중복되는 닉네임이 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      pick: null,
      platformType: 'local',
    });

    return createUser;
  }

  async duplicatedLoginId(loginId: string): Promise<boolean> {
    const isDupLoginId = await this.userModel.findOne({ where: { loginId } });

    if (isDupLoginId) {
      return true;
    }

    return false;
  }

  async duplicatedNickname(nickname: string): Promise<boolean> {
    const isDupNickname = await this.userModel.findOne({ where: { nickname } });

    if (isDupNickname) {
      return true;
    }

    return false;
  }
}
