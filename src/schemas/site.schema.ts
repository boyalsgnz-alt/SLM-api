import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { Organization } from './organization.schema';
import { User } from './user.schema';

export type SiteDocument = Mongoose.HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization;

  @Prop()
  name: string;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
