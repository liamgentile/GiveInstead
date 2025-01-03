import { Test, TestingModule } from '@nestjs/testing';
import { OccasionController } from '../../src/occasions/controllers/occasions.controller';
import { OccasionService } from '../../src/occasions/services/occasions.service';
import { NotFoundException } from '@nestjs/common';
import { OccasionDto } from '../../src/occasions/dto/occasion.dto';
import mongoose from 'mongoose';

const mongooseMock = require('mongoose-mock');

const occasionSchema = new mongoose.Schema({
    name: String,
    description: String,
    type: String,
    clerk_user_id: String,
    url: String,
    start: Date,
    end: Date,
    charities: [{
      every_id: String,
      name: String,
      donations: Array,
    }],
  });
  
  const Occasion = mongooseMock.model('Occasion', occasionSchema);
  
  const mockCharity = {
    every_id: 'charity-id',
    every_slug: 'charity-slug',
    name: 'Charity Name',
    website: 'https://charity.example',
    description: 'A great cause.',
    image_url: 'https://charity.example/logo.png',
    donations: [],
  };
  
  const mockOccasions = [
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Birthday Party',
      description: 'test description',
      type: 'birthday',
      clerk_user_id: '123',
      url: 'birthday-party',
      start: new Date(),
      end: new Date(),
      charities: [mockCharity],
    } as typeof Occasion,
  ];

describe('OccasionController', () => {
  let controller: OccasionController;
  let occasionService: OccasionService;

  const mockOccasionService = {
    createOccasion: jest.fn(),
    findByUser: jest.fn(),
    findByUrl: jest.fn(),
    updateOccasion: jest.fn(),
    deleteOccasion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccasionController],
      providers: [{ provide: OccasionService, useValue: mockOccasionService }],
    }).compile();

    controller = module.get<OccasionController>(OccasionController);
    occasionService = module.get<OccasionService>(OccasionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an occasion', async () => {
      const createDto: OccasionDto = {
        clerk_user_id: '123',
        name: 'Birthday Party',
        description: 'A fun birthday celebration',
        type: 'Birthday',
        start: new Date(),
        end: new Date(),
        url: 'birthday-party',
        charities: [mockCharity],
      };

      const createdOccasion = { ...createDto, _id: '1' };
      mockOccasionService.createOccasion.mockResolvedValue(createdOccasion);

      const result = await controller.createOccasion(createDto);
      expect(result).toEqual(createdOccasion);
      expect(mockOccasionService.createOccasion).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error if creation fails', async () => {
      const createDto: OccasionDto = {
        clerk_user_id: '123',
        name: 'Birthday Party',
        description: 'A fun birthday celebration',
        type: 'Birthday',
        start: new Date(),
        end: new Date(),
        url: 'birthday-party',
        charities: [mockCharity],
      };

      mockOccasionService.createOccasion.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(controller.createOccasion(createDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(mockOccasionService.createOccasion).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should successfully update an occasion', async () => {
      const updateDto: OccasionDto = {
        name: 'Updated Birthday Party',
        description: 'Updated description',
        type: 'Birthday',
        start: new Date(),
        end: new Date(),
        url: 'updated-birthday-party',
        charities: [mockCharity],
        clerk_user_id: '123',
      };

      const updatedOccasion = { ...updateDto };
      mockOccasionService.updateOccasion.mockResolvedValue(updatedOccasion);

      const result = await controller.updateOccasion('1', updateDto);
      expect(result).toEqual(updatedOccasion);
      expect(mockOccasionService.updateOccasion).toHaveBeenCalledWith(
        '1',
        updateDto,
      );
    });

    it('should throw an error if update fails', async () => {
      const updateDto: OccasionDto = {
        name: 'Updated Birthday Party',
        description: 'Updated description',
        type: 'Birthday',
        start: new Date(),
        end: new Date(),
        url: 'updated-birthday-party',
        clerk_user_id: '123',
        charities: [mockCharity],
      };

      mockOccasionService.updateOccasion.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        controller.updateOccasion('1', updateDto),
      ).rejects.toThrowError('Update failed');
      expect(mockOccasionService.updateOccasion).toHaveBeenCalledWith(
        '1',
        updateDto,
      );
    });
  });

  describe('delete', () => {
    it('should successfully delete an occasion', async () => {
        mockOccasionService.deleteOccasion.mockResolvedValue(undefined);

      await expect(controller.deleteOccasion('1')).resolves.toBeUndefined();
      expect(mockOccasionService.deleteOccasion).toHaveBeenCalledWith('1');
    });

    it('should throw an error if deletion fails', async () => {
        mockOccasionService.deleteOccasion.mockRejectedValue(
        new Error('Deletion failed'),
      );

      await expect(controller.deleteOccasion('1')).rejects.toThrow(
        'Deletion failed',
      );
      expect(mockOccasionService.deleteOccasion).toHaveBeenCalledWith('1');
    });
  });

  describe('findByUser', () => {
    it('should return occasions for a given user', async () => {
        mockOccasionService.findByUser.mockResolvedValue(mockOccasions); 
      
        const result = await controller.findByUser('123');
        expect(result).toEqual(mockOccasions);
        expect(mockOccasionService.findByUser).toHaveBeenCalledWith('123'); 
      });
      it('should throw a NotFoundException if no occasions are found', async () => {
        mockOccasionService.findByUser.mockResolvedValue([]);
      
        await expect(controller.findByUser('123')).rejects.toThrow(
          new NotFoundException('No occasions found for user 123')
        );
        expect(mockOccasionService.findByUser).toHaveBeenCalledWith('123');
      });
  });

  describe('findByUrl', () => {
    it('should return an occasion by URL', async () => {
        mockOccasionService.findByUrl.mockResolvedValue(mockOccasions[0]);  
        
        const result = await controller.findByUrl('birthday-party');
        expect(result).toEqual(mockOccasions[0]); 
        expect(mockOccasionService.findByUrl).toHaveBeenCalledWith('birthday-party');  
      });
  
      it('should throw a NotFoundException if no occasion is found by URL', async () => {
        mockOccasionService.findByUrl.mockResolvedValue(null);
  
        await expect(controller.findByUrl('birthday-party')).rejects.toThrow(
          new NotFoundException('Occasion with URL birthday-party not found'),
        );

        expect(mockOccasionService.findByUrl).toHaveBeenCalledWith('birthday-party');
      });
  });
});
