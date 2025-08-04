import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OccasionDto } from '../dto/occasion.dto';
import { Occasion } from '../schemas/occasion.schema';

@Injectable()
export class OccasionService {
  private readonly logger = new Logger(OccasionService.name);

  constructor(
    @InjectModel(Occasion.name) private occasionModel: Model<Occasion>,
  ) {}

  async createOccasion(createOccasionDto: OccasionDto): Promise<Occasion> {
    try {
      return await this.occasionModel.create(createOccasionDto);
    } catch (error) {
      this.logger.error('Error creating occasion:', error.stack);
      throw new InternalServerErrorException('Error creating occasion');
    }
  }

  async findByUser(clerk_user_id: string): Promise<Occasion[]> {
    try {
      return await this.occasionModel.find({ clerk_user_id });
    } catch (error) {
      this.logger.error('Error finding occasions for user:', error.stack);
      throw new InternalServerErrorException('Error finding occasions by user');
    }
  }

  async findByUrl(url: string): Promise<Occasion> {
    try {
      const result = await this.occasionModel.findOne({ url });
      if (!result) {
        throw new NotFoundException(`Occasion with URL ${url} not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error finding occasion by URL:', error.stack);
      throw new InternalServerErrorException('Error finding occasion by URL');
    }
  }

  async updateOccasion(_id: string, updateOccasionDto: OccasionDto): Promise<Occasion> {
    try {
      // Prevent NoSQL injection: reject any keys starting with '$'
      if (Object.keys(updateOccasionDto).some(key => key.startsWith('$'))) {
        throw new InternalServerErrorException('Invalid update object');
      }
      const updatedOccasion = await this.occasionModel.findByIdAndUpdate(
        _id,
        { $set: updateOccasionDto },
        { new: true },
      );
      if (!updatedOccasion) {
        throw new NotFoundException(`Occasion with ID ${_id} not found`);
      }
      return updatedOccasion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error updating occasion:', error.stack);
      throw new InternalServerErrorException('Error updating occasion');
    }
  }

  async deleteOccasion(_id: string): Promise<void> {
    try {
      const result = await this.occasionModel.deleteOne({ _id: _id });
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Occasion with ID ${_id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error deleting occasion:', error.stack);
      throw new InternalServerErrorException('Error deleting occasion');
    }
  }
}
