import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOccasionDto } from '../dto/createOccasion.dto';
import { UpdateOccasionDto } from '../dto/updateOccasion.dto';
import { Occasion } from '../schemas/occasion.schema';

@Injectable()
export class OccasionService {
  constructor(
    @InjectModel(Occasion.name) private occasionModel: Model<Occasion>,
  ) {}

  async createOccasion(createOccasionDto: CreateOccasionDto): Promise<Occasion> {
    const occasion = new this.occasionModel(createOccasionDto);
    return await occasion.save();
  }

  async findByUser(clerk_user_id: string) {
    return this.occasionModel.find({ clerk_user_id });
  }

  async findByUrl(url: string) {
    console.log("Searching for occasion with URL:", url);
    const result = await this.occasionModel.findOne({ url });
    console.log("Query result:", result);
    return result;
  }

  async updateOccasion(_id: string, updateOccasionDto: UpdateOccasionDto): Promise<Occasion> {
    const updatedOccasion = await this.occasionModel.findByIdAndUpdate(_id, updateOccasionDto, {
      new: true,
    });
    if (!updatedOccasion) {
      throw new NotFoundException(`Occasion with ID ${_id} not found`);
    }
    return updatedOccasion;
  }

  async deleteOccasion(_id: string): Promise<void> {
    const result = await this.occasionModel.deleteOne({ _id: _id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Occasion with ID ${_id} not found`);
    }
  }
}
