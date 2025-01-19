import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  Injectable,
} from '@nestjs/common';
import { FavouriteCharitiesService } from '../services/favouriteCharities.service';
import { CreateFavouriteCharityDto } from '../dto/createFavouriteCharity.dto';
import { UpdateFavouriteCharityNoteDto } from '../dto/updateFavouriteCharityNote.dto';
import { FavouriteCharity } from '../schemas/favouriteCharity.schema';

@Injectable()
@Controller('api/favourite-charity')
export class FavouriteCharityController {
  private readonly logger = new Logger(FavouriteCharityController.name);

  constructor(
    private readonly favouriteCharitiesService: FavouriteCharitiesService,
  ) {}

  @Post()
  async create(@Body() createFavouriteCharityDto: CreateFavouriteCharityDto): Promise<FavouriteCharity> {
    try {
      return await this.favouriteCharitiesService.create(
        createFavouriteCharityDto,
      );
    } catch (error) {
      this.logger.error('Error creating favourite charity:', error.stack);
      throw error;
    }
  }

  @Post('note')
  async updateNote(
    @Body() updateFavouriteCharityNoteDto: UpdateFavouriteCharityNoteDto,
  ): Promise<FavouriteCharity> {
    try {
      return await this.favouriteCharitiesService.updateNote(
        updateFavouriteCharityNoteDto,
      );
    } catch (error) {
      this.logger.error('Error updating favourite charity note:', error.stack);
      throw error;
    }
  }

  @Get('user/:clerkUserId')
  async findByUser(@Param('clerkUserId') clerkUserId: string): Promise<FavouriteCharity[]> {
    try {
      return await this.favouriteCharitiesService.findByUser(clerkUserId);
    } catch (error) {
      this.logger.error(
        'Error retrieving favourite charities by user:',
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      return await this.favouriteCharitiesService.remove(id);
    } catch (error) {
      this.logger.error('Error removing favourite charity:', error.stack);
      throw error;
    }
  }
}
