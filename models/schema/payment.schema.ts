import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ ref: 'Order', required: true })
  orderId: string; // Tham chiếu đến bảng Orders

  @Prop({ ref: 'User', required: true })
  userId: string; // Tham chiếu đến bảng Users

  @Prop({ required: true, min: 0 })
  amount: number; // Số tiền thanh toán

  @Prop({ required: true, default: 'VND' })
  currency: string; // Loại tiền tệ

  @Prop({ required: true, enum: ['credit_card', 'bank_transfer', 'e-wallet'] })
  paymentMethod: string; // Phương thức thanh toán

  @Prop({
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  })
  status: string; // Trạng thái thanh toán

  @Prop()
  transactionId: string; // Mã giao dịch từ bên thứ ba

  @Prop()
  provider: string; // Nhà cung cấp dịch vụ thanh toán
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export type PaymentDocument = Payment & Document;
