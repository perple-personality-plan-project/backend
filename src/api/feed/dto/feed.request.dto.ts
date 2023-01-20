import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedRequestDto {
  @ApiProperty({
    example: '[{thumbnail1.jpg},{thumbnail2.jpg}]',
    description: 'thumbnail',
    required: true,
  })
  thumbnail: string;

  @ApiProperty({
    example: '나만의 연남동 핫플 공유한다!',
    description: 'description',
    required: true,
  })
  @IsString({ message: 'description는 문자열 입니다.' })
  @IsNotEmpty({ message: 'description는 필수값 입니다.' })
  description: string;

  @ApiProperty({
    example: '왕십리 곱창',
    description: 'location',
    required: true,
  })
  @IsString({ message: 'description는 문자열 입니다.' })
  @IsNotEmpty({ message: 'description는 필수값 입니다.' })
  location: string;
}
