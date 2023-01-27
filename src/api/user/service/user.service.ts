import {
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/db/models/user.models';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UserRepository } from '../user.repository';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { GroupRepository } from '../../group/group.repository';
import { AwsS3Service } from 'src/common/utils/asw.s3.service';
import { Group } from 'src/db/models/group.models';
import { Feed } from 'src/db/models/feed.models';
import { Pick } from 'src/db/models/pick.models';

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

    const createUser = await this.userRepository.createUser(createUserDto);

    if (!createUser) {
      throw new BadRequestException('회원가입에 실패했습니다.');
    }

    return createUser;
  }

  async updatedProfile(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<[affectedCount: number]> {
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

    if (updatedProfile[0] === 0) {
      throw new BadRequestException('프로필 수정에 실패하였습니다.');
    }

    return updatedProfile;
  }

  async updateBackground(
    user_id: number,
    files: Array<Express.Multer.File>,
  ): Promise<[affectedCount: number]> {
    const data = await this.awsS3Service.uploadFileToS3(files);
    const background_img = data[0]['key'].split('/')[1];

    return this.userRepository.updateBackground(user_id, background_img);
  }

  async updateProfile(
    user_id: number,
    files: Array<Express.Multer.File>,
  ): Promise<[affectedCount: number]> {
    const data = await this.awsS3Service.uploadFileToS3(files);
    const profile_img = data[0]['key'].split('/')[1];

    return this.userRepository.updateProfile(user_id, profile_img);
  }

  async getMypageInfo(user_id: number): Promise<object[]> {
    return this.userRepository.getMypageInfo(user_id);
  }

  async findUserByLoginId(login_id: string): Promise<User> {
    const existsUser = this.userRepository.findUserByLoginId(login_id);

    if (!existsUser) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }

    return existsUser;
  }

  async findUserByUserId(user_id: number): Promise<User> {
    const existsUser = this.userRepository.findUserByUserId(user_id);

    if (!existsUser) {
      throw new NotFoundException('존재하지 않는 회원입니다.');
    }

    return existsUser;
  }

  async getMyGroupList(user_id: number): Promise<Group[]> {
    return this.groupRepository.findMyGroupList(user_id);
  }

  async getUserFeed(user_id: number): Promise<Feed[]> {
    return this.userRepository.getUserFeed(user_id);
  }

  async getUserPick(user_id: number): Promise<Pick[]> {
    return this.userRepository.getUserPick(user_id);
  }
}
