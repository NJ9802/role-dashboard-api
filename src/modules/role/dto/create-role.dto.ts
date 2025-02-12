import { IsArray, IsString, Matches } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @Matches(/^[A-Z_]+:[A-Z_]+$/, {
    each: true,
    message: 'Each permission must follow the format "ENTITY:PERMISSION"',
  })
  permissions: string[];
}
