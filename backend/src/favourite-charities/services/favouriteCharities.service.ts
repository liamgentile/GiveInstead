
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFavouriteCharityDto } from '../dto/createFavouriteCharity.dto';
import { FavouriteCharity } from '../schemas/favouriteCharity.schema';

@Injectable()
export class FavouriteCharitiesService {
  constructor(@InjectModel(FavouriteCharity.name) private favouriteCharityModel: Model<FavouriteCharity>) {}

  async create(createFavouriteCharityDto: CreateFavouriteCharityDto): Promise<FavouriteCharity> {
    const createdFavouriteCharity = new this.favouriteCharityModel(createFavouriteCharityDto);
    return createdFavouriteCharity.save();
  }

  async remove(id: string): Promise<FavouriteCharity | null> {
    const favouriteCharity = await this.favouriteCharityModel.findByIdAndDelete(id).exec();
    if (!favouriteCharity) {
      throw new Error('Favourite charity not found');
    }
    return favouriteCharity;
  }

  async findAll(): Promise<FavouriteCharity[]> {
    return this.favouriteCharityModel.find().exec();
  }
}
