import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationController } from '../controllers/donations.controller';
import { OccasionController } from '../controllers/occasions.controller';
import { StatsController } from '../controllers/stats.controller';
import { Occasion, OccasionSchema } from '../schemas/occasion.schema';
import { DonationService } from '../services/donations.service';
import { OccasionService } from '../services/occasions.service';
import { StatsService } from '../services/stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Occasion.name, schema: OccasionSchema },
    ]),
  ],
  controllers: [OccasionController, DonationController, StatsController],
  providers: [OccasionService, DonationService, StatsService],
})
export class OccasionsModule {}
