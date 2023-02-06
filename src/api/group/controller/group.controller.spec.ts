import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from 'src/api/group/controller/group.controller';
import { GroupService } from 'src/api/group/service/group.service';
import { GroupRepository } from '../group.repository';
import { FeedRepository } from '../../feed/feed.repository';
import { AwsS3Service } from '../../../common/utils/asw.s3.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../../../db/models/group.models';
import { GroupUser } from '../../../db/models/groupUser.models';
import { GroupHashtag } from '../../../db/models/groupHahtag.models';
import { Hashtag } from '../../../db/models/hashtag.models';
import { Map } from '../../../db/models/map.models';
import { Feed } from '../../../db/models/feed.models';
import { User } from '../../../db/models/user.models';
import { Like } from '../../../db/models/like.models';
import { Comment } from '../../../db/models/comment.models';
import { Pick } from '../../../db/models/pick.models';
import { BadRequestException } from '@nestjs/common';

describe('GroupController', () => {
  let groupController: GroupController;
  let groupService: GroupService;
  let groupRepository: GroupRepository;
  let feedRepository: FeedRepository;
  let awsS3Service: AwsS3Service;

  beforeEach(async () => {
    groupService = new GroupService(
      groupRepository,
      feedRepository,
      awsS3Service,
    );
    groupController = new GroupController(groupService);
  });

  it('should be defined', () => {
    expect(groupController).toBeDefined();
  });

  describe('getGroup', () => {
    it('유효 하지 않은 정렬', async () => {
      const spy = jest.spyOn(groupService, 'getGroup');
      // const result = await ;
      await expect(
        groupController.getGroup({
          sort: 'test',
          search: '',
        }),
      ).rejects.toThrowError('정렬은 인기순/생성순만 있습니다.');
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({
        sort: 'test',
        search: '',
      });
    });
    it('랭킹순 정렬', async () => {
      const spy = jest.spyOn(groupService, 'getGroup');
      const result = groupController.getGroup({ sort: 'rank' });
    });
  });
});
