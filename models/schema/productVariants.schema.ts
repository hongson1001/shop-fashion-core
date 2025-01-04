import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ProductVariants {
  @Prop()
  productId: string;

  @Prop()
  price: number;

  @Prop()
  stockQuantity: number;

  @Prop()
  sku: string;
}

export const ProductVariantsSchema =
  SchemaFactory.createForClass(ProductVariants);

export type ProductVariantsDocument = ProductVariants & Document;
