import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClerkClient } from '@clerk/clerk-sdk-node';
import { UserStats } from '../models/user-stats.model';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectModel('UserStats') private userStatsModel: Model<UserStats>,
    private clerkClient: ClerkClient,
  ) {}

  async createOrUpdateUserStats(
    clerkUserId: string,
    statsData: Partial<UserStats>,
  ) {
    await this.clerkClient.users.getUser(clerkUserId);

    return this.userStatsModel.findOneAndUpdate(
      { clerkUserId },
      {
        $set: {
          ...statsData,
          clerkUserId,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async getUserStatsByClerkId(clerkUserId: string) {
    await this.clerkClient.users.getUser(clerkUserId);

    return this.userStatsModel.findOne({ clerkUserId });
  }
}
