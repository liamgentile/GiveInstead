import { Test, TestingModule } from '@nestjs/testing';
import { DonationService } from '../../src/occasions/services/donations.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { EveryDotOrgWebhookDto } from '../../src/occasions/dto/everyDotOrgWebhook.dto';
import { Donation, Occasion } from '../../src/occasions/schemas/occasion.schema';
import { NotFoundException } from '@nestjs/common';

const mongooseMock = require('mongoose-mock');

const donationSchema = new mongooseMock.Schema({
  amount: Number,
  donor_name: String,
  created_at: Date,
  message: String,
});

const charitySchema = new mongooseMock.Schema({
  every_slug: String,
  name: String,
  description: String,
  logo_url: String,
  donations: [donationSchema],
});

const occasionSchema = new mongooseMock.Schema({
  clerk_user_id: String,
  name: String,
  description: String,
  type: String,
  start: Date,
  end: Date,
  url: String,
  charities: [charitySchema],
});

const DonationModel = mongooseMock.model('Donation', donationSchema);
const OccasionModel = mongooseMock.model('Occasion', occasionSchema);

describe('DonationService', () => {
  let service: DonationService;
  let donationModel: typeof DonationModel;
  let occasionModel: typeof OccasionModel;

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
      name: 'Test Nonprofit'
    },
    amount: '100.00',
    netAmount: '95.00',
    currency: 'USD',
    frequency: 'One-time',
    publicTestimony: 'Great cause!',
    privateNote: undefined,
    fromFundraiser: undefined,
    paymentMethod: 'card'
  };

  const mockOccasion = new OccasionModel({
    _id: mockOccasionId,
    clerk_user_id: 'user_123',
    name: 'Test Occasion',
    description: 'Test Description',
    type: 'birthday',
    start: new Date(),
    end: new Date(),
    url: 'test-url',
    charities: [{
      every_slug: 'test-nonprofit',
      name: 'Test Nonprofit',
      description: 'Test Description',
      logo_url: 'test-logo-url',
      donations: []
    }]
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationService,
        {
          provide: getModelToken(Donation.name),
          useValue: DonationModel,
        },
        {
          provide: getModelToken(Occasion.name),
          useValue: OccasionModel,
        },
      ],
    }).compile();

    service = module.get<DonationService>(DonationService);
    donationModel = module.get(getModelToken(Donation.name));
    occasionModel = module.get(getModelToken(Occasion.name));
  });

  describe('createDonation', () => {
    it('should successfully create a donation and update occasion', async () => {
      const mockDonation = new DonationModel({
        amount: 100,
        donor_name: 'John Doe',
        created_at: new Date(),
        message: 'Great cause!'
      });

      jest.spyOn(occasionModel, 'findOne').mockResolvedValue(mockOccasion);
      jest.spyOn(donationModel, 'create').mockResolvedValue(mockDonation);
      jest.spyOn(mockOccasion, 'save').mockResolvedValue(mockOccasion);

      const result = await service.createDonation(mockWebhookDto);

      expect(result).toEqual(mockDonation);
      expect(occasionModel.findOne).toHaveBeenCalledWith({ 
        _id: new Types.ObjectId(mockWebhookDto.partnerDonationId) 
      });
      expect(donationModel.create).toHaveBeenCalledWith({
        amount: mockWebhookDto.amount,
        donor_name: 'John Doe',
        created_at: expect.any(Date),
        message: mockWebhookDto.publicTestimony,
      });
      expect(mockOccasion.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when occasion is not found', async () => {
      jest.spyOn(occasionModel, 'findOne').mockResolvedValue(null);

      await expect(service.createDonation(mockWebhookDto)).rejects.toThrow(
        new NotFoundException('Occasion not found for the provided partnerDonationId')
      );
    });

    it('should throw NotFoundException when charity is not found in occasion', async () => {
        const occasionWithoutCharity = new OccasionModel({
          _id: mockOccasionId,
          clerk_user_id: 'user_123',
          name: 'Test Occasion',
          description: 'Test Description',
          type: 'birthday',
          start: new Date(),
          end: new Date(),
          url: 'test-url',
          charities: [{
            every_slug: 'different-slug',
            name: 'Different Nonprofit',
            donations: []
          }]
        });
  
        jest.spyOn(occasionModel, 'findOne').mockResolvedValue(occasionWithoutCharity);
  
        await expect(service.createDonation(mockWebhookDto)).rejects.toThrow(
          new NotFoundException('Charity not found for the provided slug in the occasion')
        );
      });

    it('should handle anonymous donations when name is not provided', async () => {
      const anonymousDto = {
        ...mockWebhookDto,
        firstName: undefined,
        lastName: undefined
      };

      const anonymousDonation = new DonationModel({
        amount: 100,
        donor_name: 'Anonymous',
        created_at: new Date(),
        message: 'Great cause!'
      });

      jest.spyOn(occasionModel, 'findOne').mockResolvedValue(mockOccasion);
      jest.spyOn(donationModel, 'create').mockResolvedValue(anonymousDonation);
      jest.spyOn(mockOccasion, 'save').mockResolvedValue(mockOccasion);

      const result = await service.createDonation(anonymousDto);

      expect(result.donor_name).toBe('Anonymous');
    });

    it('should handle donations without any message', async () => {
      const noMessageDto = {
        ...mockWebhookDto,
        publicTestimony: undefined,
        privateNote: undefined
      };

      const noMessageDonation = new DonationModel({
        amount: 100,
        donor_name: 'John Doe',
        created_at: new Date()
      });

      jest.spyOn(occasionModel, 'findOne').mockResolvedValue(mockOccasion);
      jest.spyOn(donationModel, 'create').mockResolvedValue(noMessageDonation);
      jest.spyOn(mockOccasion, 'save').mockResolvedValue(mockOccasion);

      const result = await service.createDonation(noMessageDto);

      expect(result.message).toBeUndefined();
    });
  });
});