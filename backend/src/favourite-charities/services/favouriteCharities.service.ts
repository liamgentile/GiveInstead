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
      console.log(
        'Creating favourite charity with data:',
        createFavouriteCharityDto,
      );
      const createdFavouriteCharity = new this.favouriteCharityModel(
        createFavouriteCharityDto,
      );
      const saved = await createdFavouriteCharity.save();
      console.log('Saved favourite charity:', saved);
      return saved;
    } catch (error) {
      console.error('Error creating favourite charity:', error);
      throw error;
    }
  }

  async updateNote(
    updateFavouriteCharityNoteDto: UpdateFavouriteCharityNoteDto,
  ): Promise<FavouriteCharity> {
    const { every_id, clerk_user_id, note } = updateFavouriteCharityNoteDto;

    // Find the charity by charityId and userId and update the note
    const updatedCharity = await this.favouriteCharityModel.findOneAndUpdate(
      { every_id, clerk_user_id },  // Both charityId and userId in the query
      { $set: { note } },           // Update the note field
      { new: true },                // Return the updated charity
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
