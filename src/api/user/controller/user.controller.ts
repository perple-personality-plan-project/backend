import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from '../../../common/interceptors/global.response.interceptor';
import { UserService } from 'src/api/user/service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/db/models/user.models';

@Controller('user')
@UseInterceptors(GlobalResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  @Post('/signup')
  async signup(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.userService.signUp(createUserDto);
  }
}
