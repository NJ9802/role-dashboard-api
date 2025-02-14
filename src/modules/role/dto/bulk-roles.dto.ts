import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateOrUpdateDto } from './update-role.dto';

export class BulkRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrUpdateDto)
  roles: CreateOrUpdateDto[];

  @IsArray()
  @IsString({ each: true })
  deleteRoles: string[];
}
