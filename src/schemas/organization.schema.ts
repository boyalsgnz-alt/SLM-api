import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { User } from './user.schema';

export type OrganizationDocument = Mongoose.HydratedDocument<Organization>;

@Schema({ timestamps: true })
export class Organization {
  @Prop()
  name: string;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
