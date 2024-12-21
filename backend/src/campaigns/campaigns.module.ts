import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CampaignSchema } from './models/campaign.model';
import { CampaignService } from './services/campaign.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Campaign', schema: CampaignSchema }
    ])
  ],
  providers: [CampaignService],
  exports: [CampaignService]
})
export class CampaignsModule {}