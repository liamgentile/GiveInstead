import * as mongoose from 'mongoose';

export const CampaignSchema = new mongoose.Schema({
    creatorClerkUserId: { 
      type: String, 
      required: true, 
      ref: 'ClerkUser' 
    },
    title: { 
      type: String, 
      required: true 
    },
    description: String,
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'archived'],
      default: 'draft'
    },
    participants: [{
      clerkUserId: { 
        type: String, 
        required: true 
      },
      joinedAt: { 
        type: Date, 
        default: Date.now 
      },
      role: {
        type: String,
        enum: ['creator', 'member', 'admin'],
        default: 'member'
      }
    }],
    metrics: {
      totalParticipants: Number,
      startDate: Date,
      endDate: Date
    }
  }, { timestamps: true });

export interface Campaign extends mongoose.Document {
  creatorClerkUserId: string;
  title: string;
}

export const CampaignModel = mongoose.model<Campaign>('Campaign', CampaignSchema);