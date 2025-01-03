import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Charity, Occasion } from '../schemas/occasion.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Occasion.name) private occasionModel: Model<Occasion>,
  ) {}

  async getLifetimeAmountRaised(clerkUserId: string): Promise<number> {
    const result = await this.occasionModel.aggregate([
      { $match: { clerk_user_id: clerkUserId } },
      { $unwind: "$charities" },  
      { $unwind: "$charities.donations" }, 
      { $group: { _id: null, totalAmount: { $sum: "$charities.donations.amount" } } },
    ]);

    return result.length > 0 ? result[0].totalAmount : 0;
  }

  async getTopPerformingCharity(clerkUserId: string): Promise<Charity> {
    const result = await this.occasionModel.aggregate([
      { $match: { clerk_user_id: clerkUserId } },
      { $unwind: "$charities" },
      { $unwind: "$charities.donations" },
      {
        $group: {
          _id: "$charities._id",  // Group by charity ID
          amount: { $sum: "$charities.donations.amount" },
          charityName: { $first: "$charities.name" },
        },
      },
      { $sort: { amount: -1 } },  // Sort descending by totalAmount
      { $limit: 1 },  // Limit to the top charity
    ]);
  
    return result.length > 0 ? result[0] : null;
  }

  async getMostSuccessfulOccasion(clerkUserId: string): Promise<Occasion> {
    const result = await this.occasionModel.aggregate([
      { $match: { clerk_user_id: clerkUserId } },
      { $unwind: "$charities" },
      { $unwind: "$charities.donations" },
      {
        $group: {
          _id: "$_id",  // Group by occasion ID
          totalAmount: { $sum: "$charities.donations.amount" },
          occasionName: { $first: "$name" },
          startDate: { $first: "$start" },
          endDate: { $first: "$end" },
          occasionUrl: { $first: "$url" },
          charities: { $push: "$charities" },  // Include all charities
        },
      },
      { $sort: { totalAmount: -1 } },  // Sort descending by totalAmount
      { $limit: 1 },  // Limit to the most successful occasion
    ]);
  
    return result.length > 0 ? result[0] : null;
  }
  
}
