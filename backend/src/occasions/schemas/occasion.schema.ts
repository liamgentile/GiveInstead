import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OccasionDocument = HydratedDocument<Occasion>;

@Schema()
export class Donation {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  donor_name: string;

  @Prop({ required: true })
  created_at: Date;

  @Prop()
  message: string;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

@Schema()
export class Charity {
  @Prop({ required: true })
  every_id: string;

  @Prop({ required: true })
  every_slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  website: string;

  @Prop()
  description: string;

  @Prop()
  image_url: string;

  @Prop([DonationSchema])
  donations: Donation[];
}

export const CharitySchema = SchemaFactory.createForClass(Charity);

@Schema()
export class Occasion {
  @Prop({ required: true })
  clerk_user_id: string;

  @Prop({ required: true, minlength: 1, maxlength: 40 })
  name: string;

  @Prop({ required: true, minLength: 1, maxLength: 255 })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({ required: true })
  url: string;

  @Prop([CharitySchema])
  charities: Charity[];
}

export const OccasionSchema = SchemaFactory.createForClass(Occasion);

