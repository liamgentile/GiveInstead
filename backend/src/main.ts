import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV');

  if (nodeEnv === 'development') {
    const corsOrigin = configService.get<string>('CORS_ORIGIN');
    app.enableCors({
      origin: corsOrigin,  
      methods: 'GET,POST,PUT,PATCH,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    });
  }

  await app.listen(3000);
}

bootstrap();