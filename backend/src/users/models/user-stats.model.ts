import * as mongoose from 'mongoose';

export const UserStatsSchema = new mongoose.Schema({
  clerkUserId: { 
    type: String, 
    required: true, 
    ref: 'ClerkUser' 
  },
  totalPoints: { 
    type: Number, 
    default: 0 
  },
});

export interface UserStats extends mongoose.Document {
  clerkUserId: string;
  totalPoints: number;
}

export const UserStatsModel = mongoose.model<UserStats>('UserStats', UserStatsSchema);