import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserInformation {
  @Prop()
  userId: string;

  @Prop()
  idProfile: string; //Căn cước công dân

  @Prop()
  fullName: string;

  @Prop()
  birthday: string;

  @Prop({ default: 'other', enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ default: '' })
  bankBranch: string;

  @Prop({ default: '' })
  bank: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: 'active' })
  status: string;
}

export const UserInformationSchema =
  SchemaFactory.createForClass(UserInformation);

export type UserInformationDocument = UserInformation & Document;
