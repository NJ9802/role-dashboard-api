import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { BulkRolesDto } from './dto/bulk-roles.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = await this.roleModel.create(createRoleDto);
    return createdRole.save();
  }

  findAll(): Promise<Role[]> {
    return this.roleModel.find().lean().exec();
  }

  async findOne(id: string) {
    return await this.handleDatabaseFindsByIds(id, async () =>
      this.roleModel.findById(id).lean().exec(),
    );
  }

  remove(id: string) {
    return this.roleModel.findById(id).deleteOne();
  }

  async updatePermissions(id: string, permissions: string[]) {
    return await this.handleDatabaseFindsByIds(id, async () =>
      this.roleModel
        .findByIdAndUpdate(id, { permissions }, { new: true })
        .lean()
        .exec(),
    );
  }

  async saveOrUpdate(bulkRolesDto: BulkRolesDto): Promise<Role[]> {
    const bulkWrite = bulkRolesDto.roles.map((role) => {
      if (role._id && !isValidObjectId(role._id)) {
        throw new NotFoundException(
          `Role not found: ${role._id} is not a valid id`,
        );
      }

      return {
        updateOne: {
          filter: role._id ? { _id: role._id } : { name: role.name },
          update: role,
          upsert: true,
        },
      };
    });

    const bulkDelete = bulkRolesDto.deleteRoles.map((id) => {
      if (!isValidObjectId(id)) {
        throw new NotFoundException(`Role not found: ${id} is not a valid id`);
      }

      return {
        deleteOne: {
          filter: { _id: id },
        },
      };
    });

    await this.roleModel.bulkWrite([...bulkWrite, ...bulkDelete]);

    return await this.roleModel.find().lean().exec();
  }

  private async handleDatabaseFindsByIds(
    id: string,
    callback: () => Promise<Role | null>,
  ): Promise<Role> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Role not found: ${id} is not a valid id`);
    }

    try {
      const role = await callback();

      if (!role) {
        throw new NotFoundException(`Role not found: ${id} is not a valid id`);
      }

      return role;
    } catch (error: unknown) {
      if ((error as Error)?.name === 'NotFoundException') {
        throw error as NotFoundException;
      }
      throw new InternalServerErrorException((error as Error)?.message);
    }
  }
}
