import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Occasion,
    OccasionSchema,
} from '../schemas/occasion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Occasion.name, schema: OccasionSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class FavouriteCharitiesModule {}
