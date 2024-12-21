import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClerkClient } from '@clerk/clerk-sdk-node';
import { Campaign } from '../models/campaign.model';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel('Campaign') private campaignModel: Model<Campaign>,
    private clerkClient: ClerkClient,
  ) {}

  async createCampaign(
    creatorClerkUserId: string,
    campaignData: Partial<Campaign>,
  ) {
    await this.clerkClient.users.getUser(creatorClerkUserId);

    return this.campaignModel.create({
      ...campaignData,
      creatorClerkUserId,
      participants: [
        {
          clerkUserId: creatorClerkUserId,
          role: 'creator',
        },
      ],
    });
  }

  async addParticipantToCampaign(campaignId: string, clerkUserId: string) {
    await this.clerkClient.users.getUser(clerkUserId);

    return this.campaignModel.findByIdAndUpdate(
      campaignId,
      {
        $addToSet: {
          participants: {
            clerkUserId,
            role: 'member',
          },
        },
        $inc: { 'metrics.totalParticipants': 1 },
      },
      { new: true },
    );
  }
}
