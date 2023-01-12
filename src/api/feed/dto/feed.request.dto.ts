import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedRequestDto {
  @ApiProperty({
    example: '나만의 연남동 핫플',
    description: 'title',
    required: true,
  })
  @IsNotEmpty({ message: 'title 필수값 입니다.' })
  @IsString({ message: 'title 문자열 입니다.' })
  title: string;

  @ApiProperty({
    example: '[{thumbnail1.jpg},{thumbnail2.jpg}]',
    description: 'thumbnail',
    required: true,
  })
  @IsString({ message: 'thumbnail은 문자열 입니다.' })
  thumbnail: string;

  @ApiProperty({
    example: '나만의 연남동 핫플 공유한다!',
    description: 'description',
    required: true,
  })
  @IsString({ message: 'description는 문자열 입니다.' })
  @IsNotEmpty({ message: 'description는 필수값 입니다.' })
  description: string;
}
