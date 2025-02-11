import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema()
export class Role {
  @Prop({ index: true, required: true })
  name: string;

  @Prop({ type: [String] })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
