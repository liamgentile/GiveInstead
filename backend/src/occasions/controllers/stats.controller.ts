import { Controller, Get, Param } from "@nestjs/common";
import { StatsService } from "../services/stats.service";

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('lifetime-raised/:clerkUserId')
  async getLifetimeAmountRaised(@Param('clerkUserId') clerkUserId: string): Promise<number> {
    return this.statsService.getLifetimeAmountRaised(clerkUserId);
  }

  @Get('top-charity/:clerkUserId')
  async getTopPerformingCharity(@Param('clerkUserId') clerkUserId: string): Promise<any> {
    return this.statsService.getTopPerformingCharity(clerkUserId);
  }

  @Get('most-successful-occasion/:clerkUserId')
  async getMostSuccessfulOccasion(@Param('clerkUserId') clerkUserId: string): Promise<any> {
    return this.statsService.getMostSuccessfulOccasion(clerkUserId);
  }
}
