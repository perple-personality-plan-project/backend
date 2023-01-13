import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { GroupParamDto, GroupRequestDto } from '../dto/group.request.dto';
import { GroupService } from '../service/group.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Request } from 'express';

@Controller('group')
@ApiTags('group')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '전체 그룹 리스트 가져오기' })
  @Get('/:sort')
  getGroup(@Param() req: GroupParamDto) {
    return this.groupService.getGroup(req);
  }

  @ApiOperation({ summary: '그룹 만들기' })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: GroupRequestDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 412,
    description: 'groupname or description는 필수값 입니다',
  })
  @Post()
  async createGroup(@Body() body: GroupRequestDto) {
    const user_id = { user_id: 1 };
    return this.groupService.createGroup(body, user_id);
  }

  @Put('/:groupId')
  async signUpGroup(@Param() req) {
    const user_id = { user_id: 2 };
    return this.groupService.groupSignUp(user_id, req);
  }
}
