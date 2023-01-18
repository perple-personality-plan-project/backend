import { Module } from '@nestjs/common';
import { MapController } from './controller/map.controller';
import { MapService } from './service/map.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Map } from 'src/db/models/map.models';
import { MapRepository } from './map.repository';
import { User } from '../../db/models/user.models';

@Module({
  imports: [SequelizeModule.forFeature([Map, User])],
  controllers: [MapController],
  providers: [MapService, MapRepository],
  exports: [MapService, MapRepository],
})
export class MapModule {}
