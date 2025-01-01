import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OccasionController } from '../controllers/occasions.controller';
import { StatsController } from '../controllers/stats.controller';
import {
    Occasion,
    OccasionSchema,
} from '../schemas/occasion.schema';
import { OccasionService } from '../services/occasions.service';
import { StatsService } from '../services/stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Occasion.name, schema: OccasionSchema },
    ]),
  ],
  controllers: [OccasionController, StatsController],
  providers: [OccasionService, StatsService],
})
export class OccasionsModule {}
