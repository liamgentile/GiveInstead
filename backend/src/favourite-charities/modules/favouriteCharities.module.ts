import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteCharityController } from '../controllers/favouriteCharities.controller';
import { FavouriteCharity, FavouriteCharitySchema } from '../schemas/favouriteCharity.schema';
import { FavouriteCharitiesService } from '../services/favouriteCharities.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FavouriteCharity.name, schema: FavouriteCharitySchema }])],
  controllers: [FavouriteCharityController],
  providers: [FavouriteCharitiesService],
})
export class FavouriteCharitiesModule {}