import { IsArray, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
