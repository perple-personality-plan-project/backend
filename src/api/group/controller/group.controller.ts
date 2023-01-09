import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { GroupRequestDto } from '../dto/group.request.dto';
import { GroupService } from '../service/group.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('group')
@ApiTags('group')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '전체 그룹 리스트 가져오기' })
  @Get()
  getGroup() {
    return 'get Group';
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
    const userId = { userId: 1 };
    return this.groupService.createGroup(body, userId);
  }
}
