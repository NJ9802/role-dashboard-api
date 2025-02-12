import { IsArray, ValidateNested } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';
import { Type } from 'class-transformer';

export class BulkRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  roles: (CreateRoleDto & { _id?: string })[];
}
