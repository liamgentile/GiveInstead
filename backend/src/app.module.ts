import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { FavouriteCharitiesModule } from './favourite-charities/modules/favouriteCharities.module';
import { AppService } from './app.service';
import { OccasionsModule } from './occasions/modules/occasions.module';
import { ClerkModule } from './clerk/clerk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_DB_URI'), 
      })
    }),
    FavouriteCharitiesModule,
    OccasionsModule,
    ClerkModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
