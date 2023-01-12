import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupParamDto, GroupRequestDto } from '../dto/group.request.dto';
import { GroupRepository } from '../group.repository';

@Injectable()
export class GroupService {
  private GROUPSORT: object = {
    date: 'createdAt',
    rank: 'createdAt',
  };
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

  async getGroup(req: GroupParamDto) {
    const { sort } = req;
    if (sort !== 'rank' && sort !== 'date') {
      throw new BadRequestException('정렬은 인기순/생성순만 있습니다.');
    }

    return this.groupRepository.getGroup(this.GROUPSORT[sort]);
  }
}
