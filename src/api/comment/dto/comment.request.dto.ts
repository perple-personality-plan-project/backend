import { IsString, IsNotEmpty } from 'class-validator';

export class CommentRequestDto {
  @IsString({ message: 'comment는 문자열 입니다.' })
  @IsNotEmpty({ message: 'comment는 필수값 입니다.' })
  comment: string;
}
