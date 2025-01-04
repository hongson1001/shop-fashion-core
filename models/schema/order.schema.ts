import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: string; // Tham chiếu đến bảng Product

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariants',
    required: true,
  })
  variantId: string; // Tham chiếu đến bảng ProductVariants

  @Prop({ required: true, min: 1 })
  quantity: number; // Số lượng sản phẩm

  @Prop({ required: true, min: 0 })
  price: number; // Giá mỗi sản phẩm
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string; // Tham chiếu đến bảng Users

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true })
  shopId: string; // Tham chiếu đến bảng Shops

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[]; // Danh sách sản phẩm trong đơn hàng

  @Prop({ required: true, min: 0 })
  totalPrice: number; // Tổng giá trị đơn hàng

  @Prop({
    required: true,
    enum: ['pending', 'shipped', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string; // Trạng thái đơn hàng

  @Prop({ required: true, enum: ['paid', 'unpaid'], default: 'unpaid' })
  paymentStatus: string; // Trạng thái thanh toán

  @Prop({ required: true })
  address: string; // Địa chỉ giao hàng
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderDocument = Order & Document;
