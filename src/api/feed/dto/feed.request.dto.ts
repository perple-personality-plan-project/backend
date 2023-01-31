import { IsString, IsNotEmpty } from 'class-validator';

export class FeedRequestDto {
  thumbnail: string;

  @IsString({ message: 'description는 문자열 입니다.' })
  @IsNotEmpty({ message: 'description는 필수값 입니다.' })
  description: string;

  @IsString({ message: 'description는 문자열 입니다.' })
  @IsNotEmpty({ message: 'description는 필수값 입니다.' })
  location: string;
}
