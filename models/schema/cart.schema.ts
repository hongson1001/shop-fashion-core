import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CartItem {
  @Prop({
    ref: 'Product',
    required: true,
  })
  productId: string;

  @Prop({
    ref: 'ProductVariants',
    required: true,
  })
  variantId: string;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ ref: 'User', required: true })
  userId: string; // Tham chiếu đến bảng Users

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[]; // Danh sách sản phẩm trong giỏ hàng
}

export const CartSchema = SchemaFactory.createForClass(Cart);

export type CartDocument = Cart & Document;
