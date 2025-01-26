import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Voucher {
  @Prop()
  code: string; //Mã voucher

  @Prop()
  description: string;

  @Prop({ enum: ['percentage', 'fixed'], default: 'fixed' })
  discountType: string; //Loại giảm giá

  @Prop()
  discountValue: number; //Giá trị giảm

  @Prop()
  minOrderValue: number; //Giá trị đơn hàng tối thiểu

  @Prop()
  startDate: Date; //Ngày bắt đầu

  @Prop()
  endDate: Date; //ngày kết thúc

  @Prop()
  usageLimit: number; //Số lần sử dụng tối đa

  @Prop()
  usedCount: number; //Số lần đã sử dụng
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);

export type VoucherDocument = Voucher & Document;
