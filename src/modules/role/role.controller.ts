import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BulkRolesDto } from './dto/bulk-roles.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body(new ValidationPipe()) createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.roleService.update(+id, updateRoleDto);
  // }
  @Patch('/update-permissions/:id')
  updatePermissions(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updatePermissions(
      id,
      updateRoleDto.permissions || [],
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Post('/update')
  saveOrUpdateBulk(@Body(new ValidationPipe()) bulkRolesDto: BulkRolesDto) {
    return this.roleService.saveOrUpdate(bulkRolesDto.roles);
  }
}
