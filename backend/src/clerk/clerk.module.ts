import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { ClerkController } from './clerk.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],  
  controllers: [ClerkController],
  providers: [ClerkService],
})
export class ClerkModule {}