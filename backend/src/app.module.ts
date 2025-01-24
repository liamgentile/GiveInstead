import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FavouriteCharitiesModule } from './favourite-charities/modules/favouriteCharities.module';
import { OccasionsModule } from './occasions/modules/occasions.module';
import { ClerkModule } from './clerk/clerk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_DB_URI'), 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
      }),
    }),
    FavouriteCharitiesModule,
    OccasionsModule,
    ClerkModule,
  ],
})
export class AppModule {}
