import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Controller('api/clerk')
export class ClerkController {
  private readonly logger = new Logger(ClerkController.name);

  constructor(private readonly clerkService: ClerkService) {}

  @Get(':clerkUserId')
  async getUserName(
    @Param('clerkUserId') clerkUserId: string,
  ): Promise<string> {
    try {
      return await this.clerkService.getUserName(clerkUserId);
    } catch (error) {
      this.logger.error('User name not available', error.stack);
      throw new NotFoundException('User name not available');
    }
  }
}
