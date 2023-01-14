import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupParamDto, GroupRequestDto } from '../dto/group.request.dto';
import { GroupRepository } from '../group.repository';

@Injectable()
export class GroupService {
  private GROUPSORT: object = {
    date: 'created_at',
    rank: 'group_user_count',
  };
  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(body: GroupRequestDto, user_id: object) {
    const { group_name, thumbnail, description, hashtag } = body;
    const result = await this.groupRepository.findGroup({
      group_name: body['group_name'],
    });

    if (result) {
      throw new BadRequestException('이미 생성된 그룹명 입니다.');
    }

    const createGroup = await this.groupRepository.createGroup(body, user_id);

    if (hashtag.length > 0) {
      const hashtagArr = JSON.parse(hashtag.replace(/'/g, '"'));

      //해쉬태그 입력

      await Promise.all(
        hashtagArr.map(async (tag) => {
          const title = { title: tag };
          const result = await this.groupRepository.findHashtag(title);
          const groupHashtag = {
            group_id: createGroup.dataValues['group_id'],
          };

          if (!result) {
            const hashtag = await this.groupRepository.createHashtag(title);
            groupHashtag['hashtag_id'] = hashtag.dataValues['hashtag_id'];
          } else {
            groupHashtag['hashtag_id'] = result.hashtag_id;
          }

          await this.groupRepository.createGroupHashtag(groupHashtag);
        }),
      );
    }

    const groupAdmin = {
      group_id: createGroup.dataValues['group_id'],
      ...user_id,
      admin_flag: true,
    };

    await this.groupRepository.groupUserSignUp(groupAdmin);

    return '그룹 생성이 완료되었습니다.';
  }

  async getGroup(req: GroupParamDto) {
    const { sort } = req;

    if (sort !== 'rank' && sort !== 'date') {
      throw new BadRequestException('정렬은 인기순/생성순만 있습니다.');
    }

    return this.groupRepository.getGroup(this.GROUPSORT[sort]);
  }

  async groupSignUp(user_id: object, req: object) {
    const findGroupUser = await this.groupRepository.findGroupUser(user_id);
    const groupAdmin = {
      group_id: req['groupId'],
      ...user_id,
      admin_flag: false,
    };
    let result;

    if (findGroupUser) {
      const data = await this.groupRepository.destroyGroupUser(groupAdmin);
      result = '그룹 구독을 취소하였습니다.';
    } else {
      const data = await this.groupRepository.groupUserSignUp(groupAdmin);
      result = '그룹을 구독 하였습니다.';
    }
    return result;
  }
}
