import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteCharity } from '../schemas/favouriteCharity.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: FavouriteCharity.name, schema: FavouriteCharity }])],
})
export class FavouriteCharitiesModule {}