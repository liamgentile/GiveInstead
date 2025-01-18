import { Test, TestingModule } from '@nestjs/testing';
import { DonationService } from '../../src/occasions/services/donations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EveryDotOrgWebhookDto } from '../../src/occasions/dto/everyDotOrgWebhook.dto';
import { Occasion } from '../../src/occasions/schemas/occasion.schema';
import { NotFoundException } from '@nestjs/common';

describe('DonationService', () => {
  let service: DonationService;
  let occasionModel: any;

  const mockOccasionId = new Types.ObjectId();

  const mockWebhookDto: EveryDotOrgWebhookDto = {
    chargeId: 'ch_123',
    partnerDonationId: mockOccasionId.toString(),
    partnerMetadata: undefined,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    toNonprofit: {
      slug: 'test-nonprofit',
      ein: '12-3456789',
      name: 'Test Nonprofit',
    },
    amount: '100.00',
    netAmount: '95.00',
    currency: 'USD',
    frequency: 'One-time',
    publicTestimony: 'Great cause!',
    privateNote: undefined,
    fromFundraiser: undefined,
    paymentMethod: 'card',
  };

  const mockOccasion = {
    _id: mockOccasionId,
    clerk_user_id: 'user_123',
    name: 'Test Occasion',
    description: 'Test Description',
    type: 'birthday',
    start: new Date(),
    end: new Date(),
    url: 'test-url',
    charities: [
      {
        every_slug: 'test-nonprofit',
        name: 'Test Nonprofit',
        description: 'Test Description',
        logo_url: 'test-logo-url',
        donations: [],
      },
    ],
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationService,
        {
          provide: getModelToken(Occasion.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DonationService>(DonationService);
    occasionModel = module.get(getModelToken(Occasion.name));
  });

  describe('createDonation', () => {
    it('should successfully create a donation and update occasion', async () => {
      occasionModel.findOne.mockResolvedValue(mockOccasion);

      const result = await service.createDonation(mockWebhookDto);

      expect(result).toEqual({
        amount: 100,
        donor_name: 'John Doe',
        created_at: expect.any(Date),
        message: 'Great cause!',
      });
      expect(occasionModel.findOne).toHaveBeenCalledWith({
        _id: new Types.ObjectId(mockWebhookDto.partnerDonationId),
      });
      expect(mockOccasion.save).toHaveBeenCalled();
      expect(mockOccasion.charities[0].donations).toContainEqual(result);
    });

    it('should throw NotFoundException when occasion is not found', async () => {
      occasionModel.findOne.mockResolvedValue(null);

      await expect(service.createDonation(mockWebhookDto)).rejects.toThrow(
        new NotFoundException(
          'Occasion not found for the provided partnerDonationId',
        ),
      );
    });

    it('should throw NotFoundException when charity is not found in occasion', async () => {
      const occasionWithoutCharity = {
        ...mockOccasion,
        charities: [
          {
            every_slug: 'different-slug',
            name: 'Different Nonprofit',
            donations: [],
          },
        ],
      };

      occasionModel.findOne.mockResolvedValue(occasionWithoutCharity);

      await expect(service.createDonation(mockWebhookDto)).rejects.toThrow(
        new NotFoundException(
          'Charity not found for the provided slug in the occasion',
        ),
      );
    });

    it('should handle anonymous donations when name is not provided', async () => {
      const anonymousDto = {
        ...mockWebhookDto,
        firstName: undefined,
        lastName: undefined,
      };

      occasionModel.findOne.mockResolvedValue(mockOccasion);

      const result = await service.createDonation(anonymousDto);

      expect(result.donor_name).toBe('Anonymous');
      expect(mockOccasion.charities[0].donations).toContainEqual(result);
    });

    it('should handle donations without any message', async () => {
      const noMessageDto = {
        ...mockWebhookDto,
        publicTestimony: undefined,
        privateNote: undefined,
      };

      occasionModel.findOne.mockResolvedValue(mockOccasion);

      const result = await service.createDonation(noMessageDto);

      expect(result.message).toBeUndefined();
      expect(mockOccasion.charities[0].donations).toContainEqual(result);
    });
  });
});
