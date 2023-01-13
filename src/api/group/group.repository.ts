import { Injectable } from '@nestjs/common';
import { Group } from '../../db/models/group.models';
import { InjectModel } from '@nestjs/sequelize';
import { Hashtag } from '../../db/models/hashtag.models';
import { GroupUser } from '../../db/models/groupUser.models';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(Hashtag)
    private hashtagModel: typeof Hashtag,
    @InjectModel(GroupUser)
    private groupUser: typeof GroupUser,
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
      raw: true,
      order: [[sort, 'DESC']],
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

  //그룹유저
  async groupUserSignUp(createData: object) {
    return this.groupUser.create({ ...createData });
  }
}
