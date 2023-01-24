import {
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { GroupRepository } from '../../group/group.repository';
import { AwsS3Service } from 'src/common/utils/asw.s3.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly awsS3Service: AwsS3Service,
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

    // 비밀번호와 confirm 검사
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
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

    if (!createUser) {
      throw new BadRequestException('회원가입에 실패했습니다.');
    }

    return createUser;
  }

  async chkPicked(user_id: number, feed_id: number) {
    const isPicked = await this.userRepository.chkPicked(user_id, feed_id);
    return isPicked ? true : false;
  }

  async updatedProfile(user_id: number, updateUserDto: UpdateUserDto) {
    const { nickname } = updateUserDto;

    const currentUserInfo = await this.findUserByUserId(user_id);

    if (nickname !== currentUserInfo.nickname) {
      const isDupNickname = await this.userRepository.IsDuplicatedInputData(
        'nickname',
        nickname,
      );

      if (isDupNickname) {
        throw new ConflictException('중복되는 닉네임이 존재합니다.');
      }
    }

    const updatedProfile = this.userRepository.updatedProfile(
      user_id,
      updateUserDto,
    );

    if (!updatedProfile) {
      throw new BadRequestException('프로필 수정에 실패하였습니다.');
    }

    return updatedProfile;
  }

  async updateBackground(user_id: number, files: Array<Express.Multer.File>) {
    const data = await this.awsS3Service.uploadFileToS3(files);
    const background_img = data[0]['key'].split('/')[1];

    return this.userRepository.updateBackground(user_id, background_img);
  }

  async updateProfile(user_id: number, files: Array<Express.Multer.File>) {
    const data = await this.awsS3Service.uploadFileToS3(files);
    const profile_img = data[0]['key'].split('/')[1];

    return this.userRepository.updateProfile(user_id, profile_img);
  }

  async getMypageInfo(user_id: number) {
    return this.userRepository.getMypageInfo(user_id);
  }

  async findUserByLoginId(login_id: string) {
    return this.userRepository.findUserByLoginId(login_id);
  }

  async findUserByUserId(user_id: number) {
    return this.userRepository.findUserByUserId(user_id);
  }

  async getMyGroupList(userId) {
    return this.groupRepository.findMyGroupList(userId);
  }

  async getUserFeed(user_id) {
    return this.userRepository.getUserFeed(user_id);
  }

  async getUserPick(user_id: number) {
    return this.userRepository.getUserPick(user_id);
  }
}
