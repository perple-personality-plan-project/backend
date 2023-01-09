import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRequestDto } from '../dto/group.request.dto';
import { GroupRepository } from '../group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(body: GroupRequestDto, userId: object) {
    const result = await this.groupRepository.findGroup({
      groupname: body['groupname'],
    });

    if (result) {
      throw new BadRequestException('이미 생성된 그룹명 입니다.');
    }

    const createGroup = await this.groupRepository.createGroup(body, userId);
    if (createGroup) {
      return '그룹이 생성 되었습니다.';
    }
  }
}
