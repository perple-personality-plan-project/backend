import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    // 아이디 중복검사
    const isDupLoginId = await this.userRepository.duplicatedLoginId(
      createUserDto.loginId,
    );

    if (isDupLoginId) {
      throw new ConflictException('중복되는 아이디가 존재합니다.');
    }

    // 닉네임 중복검사
    const isDupNickname = await this.userRepository.duplicatedNickname(
      createUserDto.nickName,
    );

    if (isDupNickname) {
      throw new ConflictException('중복되는 닉네임이 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const localUser = {
      ...createUserDto,
      password: hashedPassword,
      platformType: 'local',
    };

    const createUser = await this.userRepository.createUser(localUser);

    createUser.password = undefined;

    return createUser;
  }
}
