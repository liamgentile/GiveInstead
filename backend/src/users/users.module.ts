import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserStatsSchema } from './models/user-stats.model';
import { UserStatsService } from './services/user-stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserStats', schema: UserStatsSchema }
    ])
  ],
  providers: [UserStatsService],
  exports: [UserStatsService]
})
export class UsersModule {}