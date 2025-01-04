import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop()
  code: string;

  @Prop()
  tag: string;

  @Prop()
  slug: string;

  @Prop()
  categoryId: string;

  @Prop()
  shopId: string;

  @Prop()
  name: string;

  @Prop({ default: 0 })
  stockQuantity: number;

  @Prop()
  description: string;

  @Prop({ default: 0, min: 0 })
  price: number;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  avatar: string;

  @Prop()
  productImages: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type ProductDocument = Product & Document;

ProductSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/ /g, '-');
  }
  next();
});
