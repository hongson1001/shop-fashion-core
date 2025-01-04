import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ProductVariants {
  @Prop()
  productId: string;

  @Prop()
  variantName: string; //Tên biến thể

  @Prop()
  price: number;

  @Prop()
  stockQuantity: number; //Số lượng tồn kho

  @Prop()
  sku: string;
}

export const ProductVariantsSchema =
  SchemaFactory.createForClass(ProductVariants);

export type ProductVariantsDocument = ProductVariants & Document;
