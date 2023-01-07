import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';

@Controller('group')
@UseInterceptors(GlobalResponseInterceptor)
export class GroupController {
  @Get()
  getCurrentCat() {
    return 'current cat';
  }
}
