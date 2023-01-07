import { Controller, UseInterceptors, Post } from '@nestjs/common';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { UserService } from 'src/api/user/service/user.service';

@Controller('user')
@UseInterceptors(GlobalResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  createUser() {
    this.userService.create();
    return 'CREATE!!';
  }
}
