import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userRepository: UserRepository,
  ) {}

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

  // 로그인 아이디로 유저 검색
  async findUserById(login_id: string) {
    return this.userRepository.findUserById(login_id);
  }

  // 로그아웃
  async logoutUser(refreshToken: string) {
    await this.cacheManager.del(refreshToken);
    return true;
  }
}
