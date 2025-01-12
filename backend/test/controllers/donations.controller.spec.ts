import { Test, TestingModule } from '@nestjs/testing';
import { DonationController } from '../../src/occasions/controllers/donations.controller';
import { DonationService } from '../../src/occasions/services/donations.service';
import { Logger } from '@nestjs/common';
import { EveryDotOrgWebhookDto } from '../../src/occasions/dto/everyDotOrgWebhook.dto';
import { Donation } from '../../src/occasions/schemas/occasion.schema';

describe('DonationController', () => {
  let controller: DonationController;
  let donationService: DonationService;

  const mockWebhookDto: EveryDotOrgWebhookDto = {
    chargeId: 'ch_123',
    partnerDonationId: 'pd_123',
    partnerMetadata: undefined,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    toNonprofit: {
      slug: 'nonprofit-slug',
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

  const mockDonation: Donation = {
    amount: 100,
    donor_name: 'John Doe',
    created_at: new Date(),
    message: 'Great cause!'
  };

  const mockDonationService = {
    createDonation: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationController],
      providers: [
        {
          provide: DonationService,
          useValue: mockDonationService
        }
      ]
    }).compile();

    controller = module.get<DonationController>(DonationController);
    donationService = module.get<DonationService>(DonationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDonation', () => {
    it('should successfully create a donation', async () => {
      mockDonationService.createDonation.mockResolvedValue(mockDonation);

      const result = await controller.createDonation(mockWebhookDto);

      expect(result).toEqual(mockDonation);
      expect(donationService.createDonation).toHaveBeenCalledWith(mockWebhookDto);
      expect(donationService.createDonation).toHaveBeenCalledTimes(1);
    });

    it('should handle missing optional fields', async () => {
      const dtoWithMissingFields: EveryDotOrgWebhookDto = {
        ...mockWebhookDto,
        lastName: undefined,
        publicTestimony: undefined,
        partnerMetadata: undefined,
        fromFundraiser: undefined
      };

      mockDonationService.createDonation.mockResolvedValue(mockDonation);

      const result = await controller.createDonation(dtoWithMissingFields);

      expect(result).toEqual(mockDonation);
      expect(donationService.createDonation).toHaveBeenCalledWith(dtoWithMissingFields);
    });

    it('should handle error from service', async () => {
      const error = new Error('Database error');
      mockDonationService.createDonation.mockRejectedValue(error);

      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await expect(controller.createDonation(mockWebhookDto)).rejects.toThrow(error);

      expect(loggerSpy).toHaveBeenCalledWith('Error creating donation', error.stack);
      expect(donationService.createDonation).toHaveBeenCalledWith(mockWebhookDto);
    });

    it('should handle monthly donations', async () => {
      const monthlyDto: EveryDotOrgWebhookDto = {
        ...mockWebhookDto,
        frequency: 'Monthly'
      };

      mockDonationService.createDonation.mockResolvedValue(mockDonation);

      const result = await controller.createDonation(monthlyDto);

      expect(result).toEqual(mockDonation);
      expect(donationService.createDonation).toHaveBeenCalledWith(monthlyDto);
    });

    it('should handle donations without messages', async () => {
      const dtoWithoutMessage: EveryDotOrgWebhookDto = {
        ...mockWebhookDto,
        publicTestimony: undefined,
        privateNote: undefined
      };

      const donationWithoutMessage: Donation = {
        ...mockDonation,
        message: undefined
      };

      mockDonationService.createDonation.mockResolvedValue(donationWithoutMessage);

      const result = await controller.createDonation(dtoWithoutMessage);

      expect(result).toEqual(donationWithoutMessage);
      expect(donationService.createDonation).toHaveBeenCalledWith(dtoWithoutMessage);
    });
  });
});