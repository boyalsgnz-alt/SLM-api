import { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type AddressDocument = HydratedDocument<Address>;

export class Address {
  @Prop()
  street: string;

  @Prop()
  apt_unit: string;

  @Prop()
  city: string;

  @Prop()
  postcode: number;

  @Prop()
  state: string;

  @Prop()
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
