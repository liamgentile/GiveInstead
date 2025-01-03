import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Logger,
} from '@nestjs/common';
import { OccasionService } from '../services/occasions.service';
import { OccasionDto } from '../dto/occasion.dto';
import { Occasion } from '../schemas/occasion.schema';

@Controller('occasions')
export class OccasionController {
  private readonly logger = new Logger(OccasionController.name);

  constructor(private readonly occasionService: OccasionService) {}

  @Post()
  async createOccasion(@Body() createOccasionDto: OccasionDto): Promise<Occasion> {
    try {
      return await this.occasionService.createOccasion(createOccasionDto);
    } catch (error) {
      this.logger.error('Error creating occasion', error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async updateOccasion(
    @Param('id') id: string,
    @Body() updateOccasionDto: OccasionDto,
  ): Promise<Occasion> {
    try {
      return await this.occasionService.updateOccasion(id, updateOccasionDto);
    } catch (error) {
      this.logger.error(`Error updating occasion with ID ${id}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async deleteOccasion(@Param('id') id: string): Promise<void> {
    try {
      return await this.occasionService.deleteOccasion(id);
    } catch (error) {
      this.logger.error(`Error deleting occasion with ID ${id}`, error.stack);
      throw error;
    }
  }

  @Get(':clerkUserId')
  async findByUser(@Param('clerkUserId') clerkUserId: string): Promise<Occasion[]> {
    try {
      const occasions = await this.occasionService.findByUser(clerkUserId);
      if (!occasions || occasions.length === 0) {
        throw new NotFoundException(
          `No occasions found for user ${clerkUserId}`,
        );
      }
      return occasions;
    } catch (error) {
      this.logger.error(
        `Error retrieving occasions for user ${clerkUserId}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get('url/:url')
  async findByUrl(@Param('url') url: string): Promise<Occasion> {
    try {
      const occasion = await this.occasionService.findByUrl(url);
      if (!occasion) {
        throw new NotFoundException(`Occasion with URL ${url} not found`);
      }
      return occasion;
    } catch (error) {
      this.logger.error(
        `Error retrieving occasion with URL ${url}`,
        error.stack,
      );
      throw error;
    }
  }
}
