import { Injectable } from '@nestjs/common';
import { MapRepository } from '../map.repository';

@Injectable()
export class MapService {
  constructor(private readonly mapRepository: MapRepository) {}
  async createMap(body, userId) {
    console.log(body, userId);
    const map = await this.mapRepository.createMap(body, userId);
    if (map) {
      return `${map.place_group_name} 생성 되었습니다.`;
    }
  }

  async getMapList(userId) {
    return await this.mapRepository.getMapList(userId);
  }

  async getMap(user_id, mapId) {
    return await this.mapRepository.getMap(mapId);
  }
}
