import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOccasionDto } from '../dto/createOccasion.dto';
import { UpdateOccasionDto } from '../dto/updateOccasion.dto';
import { OccasionService } from '../services/occasions.service';

@Controller('occasions')
export class OccasionController {
  constructor(private readonly occasionService: OccasionService) {}

  @Post()
  async createOccasion(@Body() createOccasionDto: CreateOccasionDto) {
    return await this.occasionService.createOccasion(createOccasionDto);
  }

  @Patch(':id')
  async updateOccasion(
    @Param('id') id: string,
    @Body() updateOccasionDto: UpdateOccasionDto,
  ) {
    return await this.occasionService.updateOccasion(id, updateOccasionDto);
  }

  @Delete(':id')
  async deleteOccasion(@Param('id') id: string) {
    return await this.occasionService.deleteOccasion(id);
  }

  @Get(':clerkUserId')
  async findByUser(@Param('clerkUserId') clerkUserId: string) {
    return this.occasionService.findByUser(clerkUserId);
  }

  @Get('url/:url')
  async findByUrl(@Param('url') url: string) {
    console.log(url);
    const occasion = await this.occasionService.findByUrl(url);
    if (!occasion) {
      throw new NotFoundException(`Occasion with URL ${url} not found`);
    }
    return occasion;
  }
}
