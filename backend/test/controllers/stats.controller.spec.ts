import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from '../../src/occasions/controllers/stats.controller';
import { StatsService } from '../../src/occasions/services/stats.service';
import { Logger } from '@nestjs/common';
import { Charity, Occasion } from 'src/occasions/schemas/occasion.schema';

describe('StatsController', () => {
  let statsController: StatsController;
  let statsService: StatsService;

  const mockStatsService = {
    getLifetimeAmountRaised: jest.fn(),
    getTopPerformingCharity: jest.fn(),
    getMostSuccessfulOccasion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: mockStatsService,
        },
        Logger,
      ],
    }).compile();

    statsController = module.get<StatsController>(StatsController);
    statsService = module.get<StatsService>(StatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLifetimeAmountRaised', () => {
    it('should return the lifetime amount raised for the given user', async () => {
      const clerkUserId = 'test-user-id';
      const mockAmount = 5000;
      jest
        .spyOn(statsService, 'getLifetimeAmountRaised')
        .mockResolvedValue(mockAmount);

      const result = await statsController.getLifetimeAmountRaised(clerkUserId);

      expect(statsService.getLifetimeAmountRaised).toHaveBeenCalledWith(
        clerkUserId,
      );
      expect(result).toBe(mockAmount);
    });

    it('should log an error and rethrow if the service throws an error', async () => {
      const clerkUserId = 'test-user-id';
      jest
        .spyOn(statsService, 'getLifetimeAmountRaised')
        .mockRejectedValue(new Error('Service Error'));
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await expect(
        statsController.getLifetimeAmountRaised(clerkUserId),
      ).rejects.toThrow('Service Error');
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error retrieving lifetime amount raised for user ${clerkUserId}`,
        expect.any(String),
      );
    });
  });

  describe('getTopPerformingCharity', () => {
    it('should return the top-performing charity for the given user', async () => {
      const clerkUserId = 'test-user-id';
      const mockCharity: Charity = {
        every_id: '123',
        name: 'Charity A',
        every_slug: 'charity-a',
        website: 'https://charitya.example.com',
        description: 'A sample charity description',
        image_url: 'https://example.com/charitya.jpg',
        donations: [],
      };
      jest
        .spyOn(statsService, 'getTopPerformingCharity')
        .mockResolvedValue(mockCharity);

      const result = await statsController.getTopPerformingCharity(clerkUserId);

      expect(statsService.getTopPerformingCharity).toHaveBeenCalledWith(
        clerkUserId,
      );
      expect(result).toBe(mockCharity);
    });

    it('should log an error and rethrow if the service throws an error', async () => {
      const clerkUserId = 'test-user-id';
      jest
        .spyOn(statsService, 'getTopPerformingCharity')
        .mockRejectedValue(new Error('Service Error'));
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await expect(
        statsController.getTopPerformingCharity(clerkUserId),
      ).rejects.toThrow('Service Error');
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error retrieving top-performing charity for user ${clerkUserId}`,
        expect.any(String),
      );
    });
  });

  describe('getMostSuccessfulOccasion', () => {
    it('should return the most successful occasion for the given user', async () => {
      const clerkUserId = 'test-user-id';

      const mockOccasion: Occasion = {
        clerk_user_id: 'test-user-id',
        name: 'Occasion A',
        description: 'A sample occasion description',
        type: 'birthday',
        start: new Date('2025-01-01'),
        end: new Date('2025-01-02'),
        url: 'https://example.com/occasion-a',
        charities: [],
      };
      jest
        .spyOn(statsService, 'getMostSuccessfulOccasion')
        .mockResolvedValue(mockOccasion);

      const result =
        await statsController.getMostSuccessfulOccasion(clerkUserId);

      expect(statsService.getMostSuccessfulOccasion).toHaveBeenCalledWith(
        clerkUserId,
      );
      expect(result).toBe(mockOccasion);
    });

    it('should log an error and rethrow if the service throws an error', async () => {
      const clerkUserId = 'test-user-id';
      jest
        .spyOn(statsService, 'getMostSuccessfulOccasion')
        .mockRejectedValue(new Error('Service Error'));
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await expect(
        statsController.getMostSuccessfulOccasion(clerkUserId),
      ).rejects.toThrow('Service Error');
      expect(loggerSpy).toHaveBeenCalledWith(
        `Error retrieving most successful occasion for user ${clerkUserId}`,
        expect.any(String),
      );
    });
  });
});
