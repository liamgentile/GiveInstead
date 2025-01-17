import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EveryDotOrgWebhookDto } from '../dto/everyDotOrgWebhook.dto';
import { Donation } from '../schemas/occasion.schema';
import { Occasion } from '../schemas/occasion.schema';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Occasion.name) private occasionModel: Model<Occasion>,
  ) {}

  async createDonation(
    everyDotOrgWebhookDto: EveryDotOrgWebhookDto,
  ): Promise<Donation> {
    const {
      partnerDonationId,
      toNonprofit,
      amount,
      firstName,
      lastName,
      publicTestimony,
      privateNote,
    } = everyDotOrgWebhookDto;

    const occasion = await this.occasionModel.findOne({ 
        _id: new Types.ObjectId(partnerDonationId),
     });

    if (!occasion) {
      throw new NotFoundException(
        'Occasion not found for the provided partnerDonationId',
      );
    }

    const charity = occasion.charities.find(
      (charity) => charity.every_slug === toNonprofit.slug,
    );

    if (!charity) {
      throw new NotFoundException(
        'Charity not found for the provided slug in the occasion',
      );
    }

    const donorName =
      firstName || lastName
        ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
        : 'Anonymous';

    const message = publicTestimony || privateNote || undefined;

    const newDonation = {
      amount: Number(amount),
      donor_name: donorName,
      created_at: new Date(),
      message,
    };

    charity.donations.push(newDonation);

    await occasion.save();

    return newDonation;
  }
}
