import { Controller, Get, Param } from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Controller('clerk')
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}

  @Get(':clerkUserId')
  async getUserName(@Param('clerkUserId') clerkUserId: string) {
    const userName = await this.clerkService.getUserName(clerkUserId);

    return { name: userName };
  }
}
