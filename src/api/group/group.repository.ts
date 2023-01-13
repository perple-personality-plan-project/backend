import { Injectable } from '@nestjs/common';
import { Group } from '../../db/models/group.models';
import { InjectModel } from '@nestjs/sequelize';
import { Hashtag } from '../../db/models/hashtag.models';
import { GroupUser } from '../../db/models/groupUser.models';
import { GroupHashtag } from '../../db/models/groupHahtag.models';
import { Feed } from '../../db/models/feed.models';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(Hashtag)
    private hashtagModel: typeof Hashtag,
    @InjectModel(GroupUser)
    private groupUser: typeof GroupUser,
    @InjectModel(GroupHashtag)
    private groupHashtagModel: typeof GroupHashtag,
  ) {}

  async createGroup(body, userId) {
    return this.groupModel.create({ ...body, ...userId });
  }

  async findGroup(findData: object) {
    return this.groupModel.findOne({
      raw: true,
      where: { ...findData },
    });
  }

  async getGroup(sort) {
    return this.groupModel.findAll({
      include: [
        {
          model: GroupUser,
          as: 'groupUser',
          attributes: [],
          required: false,
          include: [
            {
              model: Feed,
              required: false,
              attributes: [],
            },
          ],
        },
        {
          model: GroupHashtag,
          as: 'groupHashTag',
          required: false,
          attributes: [],
          include: [
            {
              model: Hashtag,
              required: false,
              attributes: ['title'],
            },
          ],
        },
      ],
      attributes: [
        'group_id',
        'group_name',
        'thumbnail',
        'description',
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('groupUser.group_user_id')),
          ),
          'group_user_count',
        ],
        [
          Sequelize.fn(
            'GROUP_CONCAT',
            Sequelize.fn(
              'DISTINCT',
              Sequelize.col('groupHashTag.hashtag.title'),
            ),
          ),
          'hashtags',
        ],
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('groupUser.feed.feed_id')),
          ),
          'feedCount',
        ],
        'created_at',
        'updated_at',
      ],
      group: ['group_id'],
      order: [[sort, 'DESC']],
      raw: false,
    });
  }

  //태그
  async findHashtag(findData: object) {
    return this.hashtagModel.findOne({
      raw: true,
      where: { ...findData },
    });
  }
  async createHashtag(title: object) {
    return this.hashtagModel.create({ ...title });
  }

  //그룹 해쉬 태그
  async createGroupHashtag(groupHashtag: object) {
    return this.groupHashtagModel.create({ ...groupHashtag });
  }

  //그룹유저
  async groupUserSignUp(createData: object) {
    return this.groupUser.create({ ...createData });
  }

  async findGroupUser(findData: object) {
    return this.groupUser.findOne({ raw: true, where: { ...findData } });
  }

  async destroyGroupUser(groupUser) {
    this.groupUser.destroy({ where: { ...groupUser } });
  }
}
