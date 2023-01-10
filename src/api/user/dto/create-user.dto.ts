import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '아이디를 입력해주세요' })
  @IsString({ message: '아이디는 문자열 형식이여야 합니다' })
  @MinLength(5, { message: '아이디는 최소 5글자입니다' })
  @MaxLength(10, { message: '아이디는 최대 10글자입니다' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/, {
    message: '영문,숫자 조합으로 입력해주세요',
  })
  loginId: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @IsString({ message: '비밀번호는 문자열 형식이여야 합니다' })
  @MinLength(8, { message: '비밀번호는 최소 8글자입니다.' })
  @MaxLength(10, { message: '비밀번호는 최대 15글자 입니다.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, {
    message: '영문,숫자 조합으로 입력해주세요',
  })
  password: string;

  @IsNotEmpty({ message: '닉네임을 입력헤주세요' })
  @IsString({ message: '닉네임은 문자열 형식이여야 합니다.' })
  @MaxLength(8, { message: '닉네임은 최대 8글자 입니다.' })
  nickName: string;

  @IsString({ message: 'mbti는 문자열 형식이여야 합니다.' })
  mbti: string;
}

export class LocalUserDto {
  loginId: string;
  password: string;
  nickName: string;
  platformType: string;
  mbti: string;
}
