import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation } from '../schemas/occasion.schema';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<Donation>,
  ) {}

  async createDonation(donation: Donation): Promise<Donation> {
   return donation;
  }
}
