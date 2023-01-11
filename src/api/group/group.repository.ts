import { Injectable } from '@nestjs/common';
import { Group } from '../../db/models/group.models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
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
}
