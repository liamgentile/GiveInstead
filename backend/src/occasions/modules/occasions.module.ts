import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OccasionController } from '../controllers/occasions.controller';
import {
    Occasion,
    OccasionSchema,
} from '../schemas/occasion.schema';
import { OccasionService } from '../services/occasions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Occasion.name, schema: OccasionSchema },
    ]),
  ],
  controllers: [OccasionController],
  providers: [OccasionService],
})
export class OccasionsModule {}
