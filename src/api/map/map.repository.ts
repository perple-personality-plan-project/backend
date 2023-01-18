import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Map } from 'src/db/models/map.models';
import { User } from '../../db/models/user.models';

@Injectable()
export class MapRepository {
  constructor(
    @InjectModel(Map)
    private mapModel: typeof Map,
  ) {}

  async createMap(body, userId) {
    console.log({ ...body, ...userId });
    return await this.mapModel.create({ ...body, ...userId });
  }

  async getMapList(userId) {
    return this.mapModel.findAll({ where: { ...userId } });
  }

  async getMap(mapId) {
    return this.mapModel.findOne({ where: { ...mapId } });
  }
}
