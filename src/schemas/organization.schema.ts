import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { User } from './user.schema';
import { Site } from './site.schema';
import { Types } from 'mongoose';
import { Address } from './address.schema';

export type OrganizationDocument = Mongoose.HydratedDocument<Organization>;

@Schema({ timestamps: true })
export class Organization {
  @Prop()
  name: string;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId | User;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId | User;

  @Prop({ type: [Mongoose.Schema.Types.ObjectId], ref: 'Site' })
  sites: Site[];

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'Address' })
  address: Address;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
