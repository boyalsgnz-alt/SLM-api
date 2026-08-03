import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { User } from './user.schema';
import { HydratedDocument } from 'mongoose';
import { Site } from './site.schema';

export type SiteMembershipDocument = HydratedDocument<SiteMembership>;

@Schema({ timestamps: true })
export class SiteMembership {
  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'Site' })
  siteId: Site;

  @Prop()
  role: 'Tradie' | 'Labourer' | 'Site Manager' | 'Admin';

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  status: 'active' | 'inactive';
}

export const SiteMembershipSchema =
  SchemaFactory.createForClass(SiteMembership);
