import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Shop {
  @Prop()
  userId: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ unique: true })
  code: string;

  @Prop()
  tag: string; //Từ khoá tìm kiếm shop dễ hơn

  @Prop()
  slug: string; //tự động tạo dựa theo name

  @Prop()
  description: string;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  @Prop({ default: 0 })
  followers: number; //Số người theo dõi shop

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number; //Đánh giá shop

  @Prop()
  banner: string;

  @Prop({ default: 0 })
  productCount: number; //Số lượng sản phẩm shop đang có

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  contactInfo: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

export type ShopDocument = Shop & Document;

ShopSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/ /g, '-');
  }
  next();
});
