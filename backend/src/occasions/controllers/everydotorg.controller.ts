import {
    Body,
    Controller,
    Post,
    Logger,
  } from '@nestjs/common';
import { DonationDto } from '../dto/donation.dto';
import { Donation } from '../schemas/occasion.schema';
import { DonationService } from '../services/donations.service';
  
  @Controller('everydotorg')
  export class EveryDotOrgController {
    private readonly logger = new Logger(EveryDotOrgController.name);
  
    constructor(private readonly donationService: DonationService) {}
  
    @Post('donation')
    async createDonation(@Body() donationDto: DonationDto): Promise<Donation> {
      try {
        return await this.donationService.createDonation(donationDto);
      } catch (error) {
        this.logger.error('Error creating donation', error.stack);
        throw error;
      }
    }
  }