import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type FavouriteCharityDocument = HydratedDocument<FavouriteCharity>;

@Schema()
export class FavouriteCharity {
  @Prop({ required: true })
  id: ObjectId;

  @Prop({ required: true })
  every_id: string;

  @Prop({ required: true })
  clerk_user_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  website: string;

  @Prop()
  description: string;
}

export const FavouriteCharitySchema = SchemaFactory.createForClass(FavouriteCharity);