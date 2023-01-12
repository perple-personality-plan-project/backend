import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsEmpty,
} from 'class-validator';
import {} from 'class-validator/types/decorator/decorators';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, {
    message: '영문,숫자 조합으로 입력해주세요',
  })
  loginId: string;

  @IsEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, {
    message: '영문,숫자 조합으로 입력해주세요',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  nickname: string;

  @IsString()
  mbti: string;
}
