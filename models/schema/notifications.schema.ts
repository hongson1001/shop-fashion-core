import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notifications {
  @Prop()
  userId: string;

  @Prop()
  type: string;

  @Prop()
  title: string;

  @Prop()
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);

export type NotificationsDocument = Notifications & Document;
