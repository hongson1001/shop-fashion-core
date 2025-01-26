import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Address {
  @Prop()
  phoneNumber: string;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop({ type: Object, default: {} })
  province?: {
    code: string;
    name: string;
    type: string;
    typeName: string;
  };

  @Prop({ type: Object, default: {} })
  district?: {
    code: string;
    name: string;
    type: string;
  };

  @Prop({ type: Object, default: {} })
  ward?: {
    code: string;
    name: string;
    type: string;
  };

  @Prop({ default: false })
  isDefault?: boolean;
}

@Schema({ timestamps: true })
export class UserInformation {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop()
  idProfile: string; //Căn cước công dân

  @Prop()
  fullName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  email: string;

  @Prop()
  birthday: string;

  @Prop({ default: 'other', enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ default: '' })
  bankBranch: string;

  @Prop({ default: '' })
  bank: string;

  @Prop({ type: [Address], default: [] })
  address: Address[];

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: 'active' })
  status: string;
}

export const UserInformationSchema =
  SchemaFactory.createForClass(UserInformation);

export type UserInformationDocument = UserInformation & Document;
