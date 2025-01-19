import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  const corsOrigin =
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_PRODUCTION_URL
      : process.env.FRONTEND_LOCALHOST;

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  });

  if (process.env.NODE_ENV !== 'production') {
    await app.listen(3000);
  }
}
bootstrap();
