import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFavouriteCharityDto } from '../dto/createFavouriteCharity.dto';
import { FavouriteCharity } from '../schemas/favouriteCharity.schema';
import { UpdateFavouriteCharityNoteDto } from '../dto/updateFavouriteCharityNote.dto';

@Injectable()
export class FavouriteCharitiesService {
  constructor(
    @InjectModel(FavouriteCharity.name)
    private favouriteCharityModel: Model<FavouriteCharity>,
  ) {}

  async create(
    createFavouriteCharityDto: CreateFavouriteCharityDto,
  ): Promise<FavouriteCharity> {
    try {
      const createdFavouriteCharity = new this.favouriteCharityModel(
        createFavouriteCharityDto,
      );
      const saved = await createdFavouriteCharity.save();
      return saved;
    } catch (error) {
      console.error('Error creating favourite charity:', error);
      throw error;
    }
  }

  async updateNote(
    updateFavouriteCharityNoteDto: UpdateFavouriteCharityNoteDto,
  ): Promise<FavouriteCharity> {
    const { _id, note } = updateFavouriteCharityNoteDto;

    const updatedCharity = await this.favouriteCharityModel.findOneAndUpdate(
      { _id },
      { $set: { note } },    
      { new: true },
    );

    if (!updatedCharity) {
      throw new Error('Charity not found or user does not have access to this charity');
    }

    return updatedCharity;
  }

  async remove(id: string): Promise<FavouriteCharity | null> {
    const favouriteCharity = await this.favouriteCharityModel
      .findByIdAndDelete(id)
      .exec();
    if (!favouriteCharity) {
      throw new Error('Favourite charity not found');
    }
    return favouriteCharity;
  }

  async findAll(): Promise<FavouriteCharity[]> {
    return this.favouriteCharityModel.find().exec();
  }

  async findByUser(clerk_user_id: string) {
    return this.favouriteCharityModel.find({ clerk_user_id });
  }
}
