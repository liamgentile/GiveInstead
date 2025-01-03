import { Test, TestingModule } from '@nestjs/testing';
import { FavouriteCharitiesService } from '../../src/favourite-charities/services/favouriteCharities.service';
import { CreateFavouriteCharityDto } from '../../src/favourite-charities/dto/createFavouriteCharity.dto';
import { UpdateFavouriteCharityNoteDto } from '../../src/favourite-charities/dto/updateFavouriteCharityNote.dto';
import mongoose from 'mongoose';
const mongooseMock = require('mongoose-mock');

// Define schema and model mock with mongoose-mock
const favouriteCharitySchema = new mongoose.Schema({
  every_id: String,
  every_slug: String,
  clerk_user_id: String,
  name: String,
  website: String,
  description: String,
  image_url: String,
  note: String,
});

// Use mongoose-mock to create the model
const FavouriteCharityMock = mongooseMock.model('FavouriteCharity', favouriteCharitySchema);

describe('FavouriteCharitiesService', () => {
  let service: FavouriteCharitiesService;

  const mockCreateDto: CreateFavouriteCharityDto = {
    every_id: '1',
    every_slug: 'slug-1',
    clerk_user_id: 'user-123',
    name: 'Charity One',
    website: 'http://charity1.com',
    description: 'A great charity',
    image_url: 'http://charity1.com/image.jpg',
  } as typeof FavouriteCharityMock;

  const mockUpdatedNoteDto: UpdateFavouriteCharityNoteDto = {
    _id: '1',
    note: 'Updated note',
  };

  const mockFavouriteCharity = {
    ...mockCreateDto,
    note: 'Original note',
    _id: '1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavouriteCharitiesService,
        {
          provide: 'FavouriteCharityModel',
          useValue: FavouriteCharityMock,
        },
      ],
    }).compile();

    service = module.get<FavouriteCharitiesService>(FavouriteCharitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a favourite charity', async () => {
      const createdCharity = { ...mockFavouriteCharity, _id: '1' };
      
      // Mock the .create method on the model
      FavouriteCharityMock.create = jest.fn().mockResolvedValue(createdCharity);

      const result = await service.create(mockCreateDto);
      expect(result).toEqual(createdCharity);
      expect(FavouriteCharityMock.create).toHaveBeenCalledWith(mockCreateDto);
    });

    it('should throw an error if creating a charity fails', async () => {  
      FavouriteCharityMock.create = jest.fn().mockRejectedValue(new Error('Error creating favourite charity'));

      try {
        await service.create(mockCreateDto);
      } catch (e) {
        expect(e.message).toBe('Error creating favourite charity');
      }
    });
  });

  describe('remove', () => {
    it('should delete a charity', async () => {
      FavouriteCharityMock.findByIdAndDelete = jest.fn().mockResolvedValue(mockFavouriteCharity);

      await expect(service.remove('1')).resolves.toBeUndefined();
      expect(FavouriteCharityMock.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if charity not found during deletion', async () => {
      FavouriteCharityMock.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      try {
        await service.remove('1');
      } catch (e) {
        expect(e.message).toBe('Favourite charity not found');
      }
    });
  });

  describe('updateNote', () => {
    it('should update the charity note', async () => {
      const updatedCharity = { ...mockFavouriteCharity, note: 'Updated note' };
      FavouriteCharityMock.findOneAndUpdate = jest.fn().mockResolvedValue(updatedCharity);

      const result = await service.updateNote(mockUpdatedNoteDto);
      expect(result).toEqual(updatedCharity);
      expect(FavouriteCharityMock.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUpdatedNoteDto._id },
        { $set: { note: mockUpdatedNoteDto.note } },
        { new: true },
      );
    });

    it('should throw an error if charity not found during note update', async () => {
      FavouriteCharityMock.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      try {
        await service.updateNote(mockUpdatedNoteDto);
      } catch (e) {
        expect(e.message).toBe('Charity not found or user does not have access to this charity');
      }
    });
  });
});
