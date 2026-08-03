import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { Organization } from './organization.schema';

export type SiteDocument = Mongoose.HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organizationId: Organization;

  @Prop()
  name: string;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
