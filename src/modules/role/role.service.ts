import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = await this.roleModel.create(createRoleDto);
    return createdRole.save();
  }

  findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findOne(id: string) {
    return await this.handleDatabaseFindsByIds(id, async () =>
      this.roleModel.findById(id).lean().exec(),
    );
  }

  // update(id: number, updateRoleDto: UpdateRoleDto) {
  //   return `This action updates a #${id} role`;
  // }

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

  private async handleDatabaseFindsByIds(
    id: string,
    callback: () => Promise<Role | null>,
  ): Promise<Role> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Role not found');
    }

    try {
      const role = await callback();

      if (!role) {
        throw new NotFoundException('Role not found');
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
