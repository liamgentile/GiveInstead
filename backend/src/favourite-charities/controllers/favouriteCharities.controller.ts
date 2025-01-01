import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FavouriteCharitiesService } from '../services/favouriteCharities.service';
import { CreateFavouriteCharityDto } from '../dto/createFavouriteCharity.dto';
import { UpdateFavouriteCharityNoteDto } from '../dto/updateFavouriteCharityNote.dto';

@Controller('favourite-charity')
export class FavouriteCharityController {
  constructor(private readonly favouriteCharitiesService: FavouriteCharitiesService) {}

  @Post()
  async create(@Body() createFavouriteCharityDto: CreateFavouriteCharityDto) {
    console.log("Received new favourite charity")
    return this.favouriteCharitiesService.create(createFavouriteCharityDto);
  }

  @Post('note')
  async updateNote(@Body() UpdateFavouriteCharityNoteDto: UpdateFavouriteCharityNoteDto) {
    console.log("Received new favourite charity")
    return this.favouriteCharitiesService.updateNote(UpdateFavouriteCharityNoteDto);
  }

  @Get('user/:clerkUserId')
  async findByUser(@Param('clerkUserId') clerkUserId: string) {
    console.log(`Received userId: ${clerkUserId}`)
    return this.favouriteCharitiesService.findByUser(clerkUserId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.favouriteCharitiesService.remove(id);
  }
}
