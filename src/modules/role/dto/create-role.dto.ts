import {
  IsArray,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsArray()
  @IsString({ each: true })
  @Matches(/^[A-Z_]+:[A-Z_]+$/, {
    each: true,
    message: 'Each permission must follow the format "ENTITY:PERMISSION"',
  })
  permissions: string[];
}
