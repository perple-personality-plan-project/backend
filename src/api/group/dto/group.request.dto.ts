import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupRequestDto {
  @ApiProperty({
    example: 'E들의 모임',
    description: 'groupName',
    required: true,
  })
  @IsNotEmpty({ message: 'groupname 필수값 입니다.' })
  @IsString({ message: 'groupname 문자열 입니다.' })
  groupname: string;

  @ApiProperty({
    example: '[{thumbnail1.jpg},{thumbnail2.jpg}]',
    description: 'thumbnail',
    required: true,
  })
  @IsString({ message: 'thumbnail은 문자열 입니다.' })
  thumbnail: string;

  @ApiProperty({
    example: '인싸들의 핫플레이스 뿌셔',
    description: 'description',
    required: true,
  })
  @IsString({ message: 'description는 문자열 입니다.' })
  @IsNotEmpty({ message: 'description는 필수값 입니다.' })
  description: string;
}
