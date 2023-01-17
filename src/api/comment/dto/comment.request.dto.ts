import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentRequestDto {
  @ApiProperty({
    example: '으와 넘 멋져요!',
    description: 'comment',
    required: true,
  })
  @IsString({ message: 'comment는 문자열 입니다.' })
  @IsNotEmpty({ message: 'comment는 필수값 입니다.' })
  comment: string;
}
