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
  birthdate: Date;

  @Prop({ required: true })
  password: string;

  @Prop()
  refresh_token: string;

  @Prop({ default: true })
  needsSetup: boolean;

  @Prop({ type: AddressSchema })
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
