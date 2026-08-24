import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AddressSchema, Address } from './address.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  genre: string;

  @Prop()
  birthdate: Date;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token: string;

  @Prop({ default: false })
  setupCompleted: boolean;

  @Prop({ default: 0 })
  setupStep: number;

  @Prop({ type: AddressSchema })
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
