import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: process.env.FRONTEND_LOCALHOST,
      methods: 'GET,POST,PUT,PATCH,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    });
  }

  const port = process.env.PORT || 3000;
  
  await app.listen(port);
}
bootstrap();