import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

let app: INestApplication<any>;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: [
        process.env.FRONTEND_PRODUCTION_URL,
        process.env.FRONTEND_LOCALHOST,
      ],
      methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    });

    await app.init();
  }
  return app;
}

export default async function handler(req, res) {
  const app = await bootstrap();
  const httpAdapter = app.getHttpAdapter();
  return httpAdapter.getInstance()(req, res);
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(app => {
    app.listen(3000);
  });
}