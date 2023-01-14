import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    // 아이디 중복검사
    const isDupLoginId = await this.userRepository.IsDuplicatedInputData(
      'login_id',
      createUserDto.login_id,
    );

    if (isDupLoginId) {
      throw new ConflictException('중복되는 아이디가 존재합니다.');
    }

    // 닉네임 중복검사
    const isDupNickname = await this.userRepository.IsDuplicatedInputData(
      'nickname',
      createUserDto.nickname,
    );

    if (isDupNickname) {
      throw new ConflictException('중복되는 닉네임이 존재합니다.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createUser = await this.userRepository.createUser(user);

    return createUser;
  }

  async chkPicked(user_id: number, feed_id: number) {
    const isPicked = await this.userRepository.chkPicked(user_id, feed_id);
    return isPicked ? true : false;
  }

  async updatedProfile(user_id: number, body) {
    const { nickname } = body;
    console.log(nickname);
    console.log(body);
    console.log(user_id);

    const currentUserInfo = await this.findUserByUserId(user_id);

    console.log(currentUserInfo);

    if (nickname !== currentUserInfo.nickname) {
      const isDupNickname = await this.userRepository.IsDuplicatedInputData(
        'nickname',
        nickname,
      );

      console.log(isDupNickname);
      if (isDupNickname) {
        throw new ConflictException('중복되는 닉네임이 존재합니다.');
      }
    }

    const updatedProfile = this.userRepository.updatedProfile(user_id, body);

    if (!updatedProfile) {
      throw new BadRequestException('프로필 수정에 실패하였습니다.');
    }

    return updatedProfile;
  }

  async findUserByLoginId(login_id: string) {
    return this.userRepository.findUserByLoginId(login_id);
  }

  async findUserByUserId(user_id: number) {
    return this.userRepository.findUserByUserId(user_id);
  }
}
