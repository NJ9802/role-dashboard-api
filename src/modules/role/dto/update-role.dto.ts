import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsString()
  _id: string;
}

export class CreateOrUpdateDto extends UpdateRoleDto {
  @IsString()
  @IsOptional()
  _id: string;
}
