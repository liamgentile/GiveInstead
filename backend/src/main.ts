import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IncomingMessage, ServerResponse } from 'http';

const appPromise = NestFactory.create(AppModule)
  .then(async (appInstance) => {
    appInstance.enableCors({
      origin: [
        process.env.FRONTEND_PRODUCTION_URL,
        process.env.FRONTEND_LOCALHOST,
      ],
      methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    });
    await appInstance.init();
    return appInstance;
  });

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const app = await appPromise;
  const httpAdapter = app.getHttpAdapter();
  return httpAdapter.getInstance()(req, res);
}

if (process.env.NODE_ENV !== 'production') {
  appPromise.then((app) => {
    app.listen(3000, () => {
      console.log('Listening on http://localhost:3000');
    });
  });
}
