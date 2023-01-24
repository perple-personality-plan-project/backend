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
  UseGuards,
  Req,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { MapService } from '../service/map.service';
import { PositiveIntPipe } from '../../../common/pipes/positiveInt.pipe';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Request } from 'express';

@Controller('map')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createMap(@Body() body, @Req() req: Request) {
    const userId = { user_id: req.user };
    return this.mapService.createMap(body, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMapList(@Req() req: Request) {
    const userId = { user_id: req.user };
    return this.mapService.getMapList(userId);
  }

  @Get('/:map_id')
  @UseGuards(AuthGuard('jwt'))
  async findMap(
    @Param('map_id', ParseIntPipe, PositiveIntPipe) map_id: number,
    @Req() req: Request,
  ) {
    const userId = { user_id: req.user };
    const mapId = { map_id };
    return this.mapService.getMap(userId, mapId);
  }
}
