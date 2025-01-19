import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;

  const corsOrigin =
    process.env.NODE_ENV === 'production'
      ? port
      : process.env.FRONTEND_LOCALHOST;

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(port);
}
bootstrap();
