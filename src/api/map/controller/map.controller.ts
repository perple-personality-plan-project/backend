import {
  Controller,
  UseFilters,
  UseInterceptors,
  Body,
  Get,
  Post,
  Param,
  Query,
  Put,
  ParseIntPipe,
  UploadedFiles,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { MapService } from '../service/map.service';
import { PositiveIntPipe } from '../../../common/pipes/positiveInt.pipe';

@Controller('map')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  async createMap(@Body() body) {
    const user_id = { user_id: 1 };
    return this.mapService.createMap(body, user_id);
  }

  @Get()
  async getMapList() {
    const user_id = { user_id: 1 };
    return this.mapService.getMapList(user_id);
  }

  @Get('/:map_id')
  async findMap(
    @Param('map_id', ParseIntPipe, PositiveIntPipe) map_id: number,
  ) {
    const user_id = { user_id: 1 };
    const mapId = { map_id };
    return this.mapService.getMap(user_id, mapId);
  }
}
