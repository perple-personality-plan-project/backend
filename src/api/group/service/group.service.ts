import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupParamDto, GroupRequestDto } from '../dto/group.request.dto';
import { GroupRepository } from '../group.repository';
import { AwsS3Service } from '../../../common/utils/asw.s3.service';
import { GroupEditDto } from '../dto/group.edit.dto';

@Injectable()
export class GroupService {
  private GROUPSORT: object = {
    date: 'created_at',
    rank: 'group_user_count',
  };
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async createGroup(
    body: GroupRequestDto,
    userId: object,
    files: Array<Express.Multer.File>,
  ) {
    const { group_name, description, hashtag } = body;
    const thumbnail = {};

    const result = await this.groupRepository.findGroup({ group_name });

    if (result) {
      throw new BadRequestException('이미 생성된 그룹명 입니다.');
    }

    const imageList = [];

    if (files) {
      const uploadImage = await this.awsS3Service.uploadFileToS3(files);
      uploadImage.map((data) => {
        const key = data['key'].split('/');
        imageList.push(key[1]);
      });
    } else {
      //디폴트 이미지로 바꿔 줘야함!
      imageList.push('default-group.png');
    }

    thumbnail['thumbnail'] = imageList.join(',');
    const createGroupObj = { group_name, description, ...thumbnail, ...userId };

    const createGroup = await this.groupRepository.createGroup(createGroupObj);

    if (hashtag.length > 0) {
      const hashtagArr = JSON.parse(hashtag.replace(/'/g, '"'));
      console.log(hashtagArr);

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
      ...userId,
      admin_flag: true,
    };

    await this.groupRepository.groupUserSignUp(groupAdmin);

    return '그룹 생성이 완료되었습니다.';
  }

  async getGroup(req: GroupParamDto) {
    const { sort, search } = req;
    let searchData = '';

    if (sort !== 'rank' && sort !== 'date') {
      throw new BadRequestException('정렬은 인기순/생성순만 있습니다.');
    }

    if (!search) {
      searchData = '';
    } else {
      searchData = search;
    }

    return this.groupRepository.getGroup(this.GROUPSORT[sort], searchData);
  }

  async groupSignUp(userId: object, groupId: object) {
    const groupAdmin = {
      ...groupId,
      ...userId,
      admin_flag: false,
    };

    const findGroupUser = await this.groupRepository.findGroupUser(groupAdmin);

    if (findGroupUser) {
      await this.groupRepository.destroyGroupUser(groupAdmin);
      return '그룹 구독을 취소하였습니다.';
    } else {
      await this.groupRepository.groupUserSignUp(groupAdmin);
      return '그룹을 구독 하였습니다.';
    }
  }

  async getGroupFeed(groupId: number) {
    return this.groupRepository.getGroupFeed(groupId);
  }

  async getGroupFeedDetail(groupId, feedId) {
    return this.groupRepository.getGroupFeedDetail(groupId, feedId);
  }

  async getSubscription(userId, groupId) {
    const groupInfo = {
      ...groupId,
      ...userId,
    };
    return this.groupRepository.findGroupUser(groupInfo);
  }

  async createGroupFeed(body, req, userId, files) {
    const feedData = body;

    const groupInfo = {
      group_id: req['groupId'],
      ...userId,
    };
    const groupUser = await this.groupRepository.findGroupUser(groupInfo);
    if (!groupUser) {
      throw new BadRequestException('구독 되지 않은 유저 입니다.');
    }

    const imageList = [];
    if (files) {
      const uploadImage = await this.awsS3Service.uploadFileToS3(files);
      uploadImage.map((data) => {
        const key = data['key'].split('/');
        imageList.push(key[1]);
      });
    } else {
      //디폴트 이미지로 바꿔 줘야함!
      imageList.push('');
    }
    feedData['thumbnail'] = imageList.join(',');

    feedData.group_user_id = groupUser.group_user_id;
    return this.groupRepository.createGroupFeed(feedData);
  }

  async groupFeedLike(userId, group_id, feed_id) {
    const likeResult = await this.groupRepository.findFeedLike(userId, feed_id);

    if (!likeResult) {
      await this.groupRepository.createGroupFeedLike(userId, feed_id);
      return '좋아요를 눌렀습니다.';
    } else {
      await this.groupRepository.deleteGroupFeedLike(likeResult.like_id);
      return '좋아요를 취소 했습니다.';
    }
  }
  async getHashTag() {
    return await this.groupRepository.getHashTag();
  }

  async deleteGroup(userId, groupId) {
    const { user_id } = userId;
    const group = await this.groupRepository.findGroup(groupId);

    if (!group['user_id'] == user_id) {
      return '본인 그룹만 삭제 할 수 있습니다.';
    }

    const deleteGroup = this.groupRepository.deleteGroup(groupId);
    if (deleteGroup) {
      return '삭제 되었습니다.';
    }
  }

  async editGroup(userId, groupId, files, editGroup) {
    const { user_id } = userId;
    const imageList = [];
    const group = await this.groupRepository.findGroup(groupId);

    if (!group['user_id'] == user_id) {
      return '본인 그룹만 수정 할 수 있습니다.';
    }

    if (files) {
      const image = group.thumbnail;
      if (image !== 'default-group.png') {
        await this.awsS3Service.deleteS3Object(image);
      }
      const uploadImage = await this.awsS3Service.uploadFileToS3(files);
      uploadImage.map((data) => {
        const key = data['key'].split('/');
        imageList.push(key[1]);
      });
    }
    editGroup.thumbnail = imageList.join(',');

    const groupHashtag = await this.groupRepository.groupHashTag(groupId);

    if (editGroup.hashtag.length > 0) {
      const hashtagArr = JSON.parse(editGroup.hashtag.replace(/'/g, '"'));
      const result = await this.groupRepository.deleteGroupHashtag(groupId);
      if (result) {
        await Promise.all(
          hashtagArr.map(async (tag) => {
            const title = { title: tag };
            const result = await this.groupRepository.findHashtag(title);

            if (!result) {
              const hashtag = await this.groupRepository.createHashtag(title);
              groupHashtag['hashtag_id'] = hashtag.dataValues['hashtag_id'];
            } else {
              groupHashtag['hashtag_id'] = result.hashtag_id;
            }

            await this.groupRepository.createGroupHashtag(groupId);
          }),
        );
      }
    }

    return '수정 되었습니다.';
  }
}
