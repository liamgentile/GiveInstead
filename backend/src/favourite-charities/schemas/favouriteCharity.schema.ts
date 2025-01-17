import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FavouriteCharityDocument = HydratedDocument<FavouriteCharity>;

@Schema()
export class FavouriteCharity {
  @Prop({ required: true })
  every_id: string;

  @Prop({ required: true })
  every_slug: string;

  @Prop({ required: true })
  clerk_user_id: string;

  @Prop()
  name: string;

  @Prop()
  website: string;

  @Prop()
  description: string;

  @Prop()
  image_url: string;

  @Prop({ maxLength: 255 })
  note: string;
}

export const FavouriteCharitySchema = SchemaFactory.createForClass(FavouriteCharity);
