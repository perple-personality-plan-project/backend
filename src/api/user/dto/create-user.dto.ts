import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, {
    message: '영문,숫자 조합으로 입력해주세요',
  })
  loginId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, {
    message: '영문,숫자 조합으로 입력해주세요',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  nickName: string;

  @IsString()
  mbti: string;
}
