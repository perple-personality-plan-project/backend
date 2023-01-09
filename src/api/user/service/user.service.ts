import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    // 아이디 중복검사
    await this.duplicatedLoginId(createUserDto.loginId);
    // 닉네임 중복검사
    await this.duplicatedNickname(createUserDto.nickName);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      platformType: 'local',
    });

    createUser.password = undefined;

    return createUser;
  }

  async duplicatedLoginId(loginId: string): Promise<boolean> {
    const isDupLoginId = await this.userModel.findOne({ where: { loginId } });

    if (isDupLoginId) {
      throw new ConflictException('중복되는 아이디가 존재합니다.');
    }

    return;
  }

  async duplicatedNickname(nickName: string): Promise<boolean> {
    const isDupNickname = await this.userModel.findOne({ where: { nickName } });

    if (isDupNickname) {
      throw new ConflictException('중복되는 닉네임이 존재합니다.');
    }

    return;
  }
}
