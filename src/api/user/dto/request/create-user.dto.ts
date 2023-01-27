import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '아이디를 입력해주세요' })
  @IsString({ message: '아이디는 문자열 형식이여야 합니다' })
  @MinLength(5, { message: '아이디는 최소 5글자입니다' })
  @MaxLength(255, { message: '아이디는 최대 10글자입니다' })
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{5,10}$/, {
    message: '아이디는 영문, 숫자 조합으로 입력해주세요',
  })
  login_id: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @IsString({ message: '비밀번호는 문자열 형식이여야 합니다' })
  @MinLength(4, { message: '비밀번호는 최소 4글자입니다.' })
  @MaxLength(255, { message: '비밀번호는 최대 10글자 입니다.' })
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%]{4,10}$/, {
    message: '비밀번호는 영문, 숫자, 특수문자 조합으로 입력해주세요',
  })
  password: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @IsString({ message: '비밀번호는 문자열 형식이여야 합니다' })
  @MinLength(4, { message: '비밀번호는 최소 4글자입니다.' })
  @MaxLength(255, { message: '비밀번호는 최대 10글자 입니다.' })
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%]{4,10}$/, {
    message: '비밀번호는 영문, 숫자, 특수문자 조합으로 입력해주세요',
  })
  confirm_password: string;

  @IsNotEmpty({ message: '닉네임을 입력헤주세요' })
  @IsString({ message: '닉네임은 문자열 형식이여야 합니다.' })
  @MaxLength(8, { message: '닉네임은 최대 8글자 입니다.' })
  @Matches(/^[가-힣a-zA-Z]{4,8}$/, {
    message: '닉네임은 한글 또는 영문으로 입력해주세요',
  })
  nickname: string;

  @IsOptional()
  @IsNotEmpty({ message: 'mbti를 입력해주세요' })
  @MaxLength(4, { message: 'mbti는 최대 4글자 입니다.' })
  @IsString({ message: 'mbti는 문자열 형식이여야 합니다.' })
  mbti: string;

  @IsString()
  provider: string;
}
