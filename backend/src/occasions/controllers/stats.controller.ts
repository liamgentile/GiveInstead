import { Controller, Get, Param, Logger } from '@nestjs/common';
import { Charity, Occasion } from '../schemas/occasion.schema';
import { StatsService } from '../services/stats.service';

@Controller('api/stats')
export class StatsController {
  private readonly logger = new Logger(StatsController.name);

  constructor(private readonly statsService: StatsService) {}

  @Get('lifetime-raised/:clerkUserId')
  async getLifetimeAmountRaised(
    @Param('clerkUserId') clerkUserId: string,
  ): Promise<number> {
    try {
      return await this.statsService.getLifetimeAmountRaised(clerkUserId);
    } catch (error) {
      this.logger.error(
        `Error retrieving lifetime amount raised for user ${clerkUserId}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get('top-charity/:clerkUserId')
  async getTopPerformingCharity(
    @Param('clerkUserId') clerkUserId: string,
  ): Promise<Charity> {
    try {
      return await this.statsService.getTopPerformingCharity(clerkUserId);
    } catch (error) {
      this.logger.error(
        `Error retrieving top-performing charity for user ${clerkUserId}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get('most-successful-occasion/:clerkUserId')
  async getMostSuccessfulOccasion(
    @Param('clerkUserId') clerkUserId: string,
  ): Promise<Occasion> {
    try {
      return await this.statsService.getMostSuccessfulOccasion(clerkUserId);
    } catch (error) {
      this.logger.error(
        `Error retrieving most successful occasion for user ${clerkUserId}`,
        error.stack,
      );
      throw error;
    }
  }
}
