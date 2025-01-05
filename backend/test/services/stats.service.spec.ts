import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from '../../src/occasions/services/stats.service';
import { getModelToken } from '@nestjs/mongoose';
import { Occasion } from '../../src/occasions/schemas/occasion.schema';
import { Model } from 'mongoose';

describe('StatsService', () => {
  let service: StatsService;
  let occasionModel: Model<Occasion>;

  const mockClerkUserId = 'user123';

  const mockOccasions = [
    {
      _id: '1',
      clerk_user_id: mockClerkUserId,
      name: 'Birthday Party',
      description: 'My 30th birthday',
      type: 'birthday',
      start: new Date('2024-01-01'),
      end: new Date('2024-01-02'),
      url: 'birthday-party',
      charities: [
        {
          _id: 'charity1',
          every_id: 'e1',
          every_slug: 'charity-1',
          name: 'Charity One',
          website: 'https://charity1.com',
          description: 'First charity',
          image_url: 'image1.jpg',
          donations: [
            { amount: 100, donor_name: 'John', created_at: new Date(), message: 'Happy birthday!' },
            { amount: 50, donor_name: 'Jane', created_at: new Date(), message: 'Congrats!' },
          ],
        },
        {
          _id: 'charity2',
          every_id: 'e2',
          every_slug: 'charity-2',
          name: 'Charity Two',
          website: 'https://charity2.com',
          description: 'Second charity',
          image_url: 'image2.jpg',
          donations: [
            { amount: 200, donor_name: 'Bob', created_at: new Date(), message: 'Great cause!' },
          ],
        },
      ],
    },
    {
      _id: '2',
      clerk_user_id: mockClerkUserId,
      name: 'Wedding',
      description: 'Our special day',
      type: 'wedding',
      start: new Date('2024-02-01'),
      end: new Date('2024-02-02'),
      url: 'wedding',
      charities: [
        {
          _id: 'charity1',
          every_id: 'e1',
          every_slug: 'charity-1',
          name: 'Charity One',
          website: 'https://charity1.com',
          description: 'First charity',
          image_url: 'image1.jpg',
          donations: [
            { amount: 300, donor_name: 'Alice', created_at: new Date(), message: 'Congratulations!' },
          ],
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getModelToken(Occasion.name),
          useValue: {
            aggregate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    occasionModel = module.get<Model<Occasion>>(getModelToken(Occasion.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLifetimeAmountRaised', () => {
    it('should return total amount raised across all occasions', async () => {
      const mockAggregateResult = [{ _id: null, totalAmount: 650 }];
      jest.spyOn(occasionModel, 'aggregate').mockResolvedValue(mockAggregateResult);

      const result = await service.getLifetimeAmountRaised(mockClerkUserId);
      
      expect(result).toBe(650);
      expect(occasionModel.aggregate).toHaveBeenCalledWith([
        { $match: { clerk_user_id: mockClerkUserId } },
        { $unwind: '$charities' },
        { $unwind: '$charities.donations' },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$charities.donations.amount' },
          },
        },
      ]);
    });

    it('should return 0 when no donations exist', async () => {
      jest.spyOn(occasionModel, 'aggregate').mockResolvedValue([]);

      const result = await service.getLifetimeAmountRaised(mockClerkUserId);
      
      expect(result).toBe(0);
    });
  });

  describe('getTopPerformingCharity', () => {
    it('should return the charity with highest total donations', async () => {
      const mockAggregateResult = [{
        _id: 'charity1',
        amount: 450,
        charityName: 'Charity One'
      }];
      
      jest.spyOn(occasionModel, 'aggregate').mockResolvedValue(mockAggregateResult);

      const result = await service.getTopPerformingCharity(mockClerkUserId);
      
      expect(result).toEqual(mockAggregateResult[0]);
      expect(occasionModel.aggregate).toHaveBeenCalledWith([
        { $match: { clerk_user_id: mockClerkUserId } },
        { $unwind: '$charities' },
        { $unwind: '$charities.donations' },
        {
          $group: {
            _id: '$charities._id',
            amount: { $sum: '$charities.donations.amount' },
            charityName: { $first: '$charities.name' },
          },
        },
        { $sort: { amount: -1 } },
        { $limit: 1 },
      ]);
    });

    it('should return null when no charities exist', async () => {
      jest.spyOn(occasionModel, 'aggregate').mockResolvedValue([]);

      const result = await service.getTopPerformingCharity(mockClerkUserId);
      
      expect(result).toBeNull();
    });
  });

  describe('getMostSuccessfulOccasion', () => {
    it('should return the occasion with highest total donations', async () => {
      const mockAggregateResult = [{
        _id: '1',
        totalAmount: 350,
        occasionName: 'Birthday Party',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        occasionUrl: 'birthday-party',
        charities: mockOccasions[0].charities
      }];
      
      jest.spyOn(occasionModel, 'aggregate').mockResolvedValue(mockAggregateResult);

      const result = await service.getMostSuccessfulOccasion(mockClerkUserId);
      
      expect(result).toEqual(mockAggregateResult[0]);
      expect(occasionModel.aggregate).toHaveBeenCalledWith([
        { $match: { clerk_user_id: mockClerkUserId } },
        { $unwind: '$charities' },
        { $unwind: '$charities.donations' },
        {
          $group: {
            _id: '$_id',
            totalAmount: { $sum: '$charities.donations.amount' },
            occasionName: { $first: '$name' },
            startDate: { $first: '$start' },
            endDate: { $first: '$end' },
            occasionUrl: { $first: '$url' },
            charities: { $push: '$charities' },
          },
        },
        { $sort: { totalAmount: -1 } },
        { $limit: 1 },
      ]);
    });

    it('should return null when no occasions exist', async () => {
      jest.spyOn(occasionModel, 'aggregate').mockResolvedValue([]);

      const result = await service.getMostSuccessfulOccasion(mockClerkUserId);
      
      expect(result).toBeNull();
    });
  });
});