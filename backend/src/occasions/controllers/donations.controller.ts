import {
    Body,
    Controller,
    Post,
    Logger,
  } from '@nestjs/common';
import { EveryDotOrgWebhookDto } from '../dto/everyDotOrgWebhook.dto';
import { Donation } from '../schemas/occasion.schema';
import { DonationService } from '../services/donations.service';
  
  @Controller('everydotorg')
  export class DonationController {
    private readonly logger = new Logger(DonationController.name);
  
    constructor(private readonly donationService: DonationService) {}
  
    @Post('donation')
    async createDonation(@Body() everyDotOrgWebhookDto: EveryDotOrgWebhookDto): Promise<Donation> {
      try {
        return await this.donationService.createDonation(everyDotOrgWebhookDto);
      } catch (error) {
        this.logger.error('Error creating donation', error.stack);
        throw error;
      }
    }
  }