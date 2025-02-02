import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LoginHistory {
  @Prop({ required: true })
  userId: string;

  @Prop({ enum: ['login', 'logout'], type: String, required: true })
  action: string;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: String, required: true })
  userAgent: string;

  @Prop()
  status: string;

  @Prop({ type: String })
  message: string;
}

export const LoginHistorySchema = SchemaFactory.createForClass(LoginHistory);

export type LoginHistoryDocument = LoginHistory & Document;
