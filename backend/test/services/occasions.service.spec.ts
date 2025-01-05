import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OccasionService } from '../../src/occasions/services/occasions.service';
import { Occasion } from '../../src/occasions/schemas/occasion.schema';
import { OccasionDto } from '.../../src/occasions/dto/occasion.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('OccasionService', () => {
  let service: OccasionService;
  let model: Model<Occasion>;

  const mockOccasionDto: OccasionDto = {
    clerk_user_id: 'user123',
    name: 'Birthday Party',
    description: 'My 30th birthday',
    type: 'birthday',
    start: new Date('2024-01-01'),
    end: new Date('2024-01-02'),
    url: 'birthday-party',
    charities: [
      {
        every_id: 'charity1',
        every_slug: 'charity-1',
        name: 'Charity One',
        website: 'https://charity1.com',
        description: 'First charity',
        image_url: 'image1.jpg',
        donations: [],
      },
    ],
  };

  const mockOccasion = {
    _id: 'occasion1',
    ...mockOccasionDto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OccasionService,
        {
          provide: getModelToken(Occasion.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OccasionService>(OccasionService);
    model = module.get<Model<Occasion>>(getModelToken(Occasion.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOccasion', () => {
    it('should create and return an occasion', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(mockOccasion as any);

      const result = await service.createOccasion(mockOccasionDto);
      
      expect(result).toEqual(mockOccasion);
      expect(model.create).toHaveBeenCalledWith(mockOccasionDto);
    });

    it('should throw InternalServerErrorException on creation error', async () => {
      jest.spyOn(model, 'create').mockRejectedValue(new Error('Database error'));

      await expect(service.createOccasion(mockOccasionDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('findByUser', () => {
    it('should return occasions for a user', async () => {
      const mockOccasions = [mockOccasion];
      jest.spyOn(model, 'find').mockResolvedValue(mockOccasions as any);

      const result = await service.findByUser('user123');

      expect(result).toEqual(mockOccasions);
      expect(model.find).toHaveBeenCalledWith({ clerk_user_id: 'user123' });
    });

    it('should throw InternalServerErrorException on find error', async () => {
      jest.spyOn(model, 'find').mockRejectedValue(new Error('Database error'));

      await expect(service.findByUser('user123'))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('findByUrl', () => {
    it('should return an occasion by URL', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockOccasion as any);

      const result = await service.findByUrl('birthday-party');

      expect(result).toEqual(mockOccasion);
      expect(model.findOne).toHaveBeenCalledWith({ url: 'birthday-party' });
    });

    it('should throw NotFoundException when occasion not found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      await expect(service.findByUrl('non-existent'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on find error', async () => {
      jest.spyOn(model, 'findOne').mockRejectedValue(new Error('Database error'));

      await expect(service.findByUrl('birthday-party'))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('updateOccasion', () => {
    it('should update and return an occasion', async () => {
      const updatedOccasion = { ...mockOccasion, name: 'Updated Birthday Party' };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedOccasion as any);

      const result = await service.updateOccasion('occasion1', mockOccasionDto);

      expect(result).toEqual(updatedOccasion);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        'occasion1',
        mockOccasionDto,
        { new: true }
      );
    });

    it('should throw NotFoundException when occasion not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(service.updateOccasion('non-existent', mockOccasionDto))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on update error', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));

      await expect(service.updateOccasion('occasion1', mockOccasionDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('deleteOccasion', () => {
    it('should delete an occasion', async () => {
      jest.spyOn(model, 'deleteOne').mockResolvedValue({ deletedCount: 1 } as any);

      await service.deleteOccasion('occasion1');

      expect(model.deleteOne).toHaveBeenCalledWith({ _id: 'occasion1' });
    });

    it('should throw NotFoundException when occasion not found', async () => {
      jest.spyOn(model, 'deleteOne').mockResolvedValue({ deletedCount: 0 } as any);

      await expect(service.deleteOccasion('non-existent'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on delete error', async () => {
      jest.spyOn(model, 'deleteOne').mockRejectedValue(new Error('Database error'));

      await expect(service.deleteOccasion('occasion1'))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });
});