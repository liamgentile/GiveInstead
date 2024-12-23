import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FavouriteCharitiesService } from '../services/favouriteCharities.service';
import { CreateFavouriteCharityDto } from '../dto/createFavouriteCharity.dto';

@Controller('favourite-charity')
export class FavouriteCharityController {
  constructor(private readonly favouriteCharitiesService: FavouriteCharitiesService) {}

  @Post()
  async create(@Body() createFavouriteCharityDto: CreateFavouriteCharityDto) {
    return this.favouriteCharitiesService.create(createFavouriteCharityDto);
  }

  @Get()
  async findAll() {
    return this.favouriteCharitiesService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.favouriteCharitiesService.remove(id);
  }
}
