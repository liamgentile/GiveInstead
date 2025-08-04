import { Model } from 'mongoose';
import { Injectable, Logger, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFavouriteCharityDto } from '../dto/createFavouriteCharity.dto';
import { FavouriteCharity } from '../schemas/favouriteCharity.schema';
import { UpdateFavouriteCharityNoteDto } from '../dto/updateFavouriteCharityNote.dto';

@Injectable()
export class FavouriteCharitiesService {
  private readonly logger = new Logger(FavouriteCharitiesService.name);

  constructor(
    @InjectModel(FavouriteCharity.name)
    private favouriteCharityModel: Model<FavouriteCharity>,
  ) {}

  async create(
    createFavouriteCharityDto: CreateFavouriteCharityDto,
  ): Promise<FavouriteCharity> {
    try {
      return await this.favouriteCharityModel.create(createFavouriteCharityDto);
    } catch (error) {
      this.logger.error('Error creating favourite charity:', error.stack);
      throw new InternalServerErrorException('Error creating favourite charity');
    }
  }

  async updateNote(
    updateFavouriteCharityNoteDto: UpdateFavouriteCharityNoteDto,
  ): Promise<FavouriteCharity> {
    try {
      const { _id, note } = updateFavouriteCharityNoteDto;

      if (typeof _id !== 'string') {
        throw new BadRequestException('Invalid _id');
      }

      const updatedCharity = await this.favouriteCharityModel.findOneAndUpdate(
        { _id: { $eq: _id } },
        { $set: { note } },
        { new: true },
      );

      if (!updatedCharity) {
        throw new NotFoundException(
          'Charity not found or user does not have access to this charity',
        );
      }

      return updatedCharity;
    } catch (error) {
      this.logger.error('Error updating charity note:', error.stack);
      throw error instanceof NotFoundException 
        ? error 
        : new InternalServerErrorException('Error updating charity note');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const favouriteCharity = await this.favouriteCharityModel.findByIdAndDelete(id);

      if (!favouriteCharity) {
        throw new NotFoundException('Favourite charity not found');
      }
    } catch (error) {
      this.logger.error('Error removing favourite charity:', error.stack);
      throw error instanceof NotFoundException 
        ? error 
        : new InternalServerErrorException('Error removing favourite charity');
    }
  }

  async findByUser(clerk_user_id: string): Promise<FavouriteCharity[]> {
    try {
      return await this.favouriteCharityModel.find({ clerk_user_id });
    } catch (error) {
      this.logger.error(
        'Error finding favourite charities for user:',
        error.stack,
      );
      throw new InternalServerErrorException('Error finding favourite charities');
    }
  }
}
