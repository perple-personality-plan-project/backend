import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupEditDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  thumbnail: string;
}
