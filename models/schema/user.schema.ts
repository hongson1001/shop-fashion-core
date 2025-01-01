import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaTypes } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  password: string;

  @Prop()
  code: string;

  @Prop()
  passCode: string;

  @Prop({ enum: ['customer', 'seller'], default: ['customer'] })
  role: string[];

  @Prop({ default: '', ref: 'Shop', type: [SchemaTypes.ObjectId] })
  shopId: string[];

  @Prop({ type: [String], default: [] })
  addresses: string[];

  @Prop({ default: 'active' })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;

UserSchema.pre<UserDocument>('save', async function (next) {
  const user = this as UserDocument;
  if (user.isModified('password') || user.isNew) {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
