import { IsOptional, IsString } from 'class-validator';
import { IsMbti } from 'src/common/decorators/validateMbti';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  @IsMbti('mbti')
  mbti: string;
}
