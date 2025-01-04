import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ProductImage {
  @Prop()
  name: string;

  @Prop()
  productId: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

export type ProductImageDocument = ProductImage & Document;
