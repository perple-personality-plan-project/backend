import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

export class UpdateMbtiDto {
  @IsString()
  @IsNotEmpty()
  @IsMbti('mbti')
  mbti: string;
}
