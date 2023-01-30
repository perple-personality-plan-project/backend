import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class MapRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  place_group: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  place_group_name: string;
}
