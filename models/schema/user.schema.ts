import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomPassword } from 'extensions/common';
import { randomBytes } from 'crypto';

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  code: string;

  @Prop()
  passCode: string; //Dùng random number để tạo passCode xong rồi khi tạo tài khoản thì password + passCode xong rồi hash lại tăng bảo mật

  @Prop({ type: [String], enum: ['customer', 'seller'], default: ['customer'] })
  role: string[];

  @Prop({ default: '', ref: 'Shop' })
  shopId?: string[];

  @Prop({ default: '' })
  refreshToken: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiresAt?: Date;

  @Prop({ default: false })
  isVerified: boolean;

  // Danh cho phần login, giới hạn số lần login
  @Prop({ type: Number, default: 0 })
  failedLoginAttempts: number;

  @Prop({ type: Number, default: 0 })
  failedLoginAttemptSeries: number;

  @Prop({ type: Date, default: null })
  lockUntil: Date;

  @Prop({ type: Boolean, default: false })
  isPermanentlyLocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;

UserSchema.pre<UserDocument>('save', async function (next) {
  try {
    const user = this as UserDocument;

    if (!user.isModified('password') && !user.isModified('passCode')) {
      return next();
    }

    if (!user.passCode) {
      user.passCode = randomPassword();
    }

    const combinedPassword = user.password + user.passCode;
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(combinedPassword, salt);

    if (!user.code) {
      user.code = randomBytes(6).toString('hex');
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.passCode;
  delete user.refreshToken;
  delete user.otp;
  return user;
};
