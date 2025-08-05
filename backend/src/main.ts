if (process.env.NODE_ENV !== 'production' && typeof global.crypto === 'undefined') {
  const { webcrypto } = require('crypto');
  (global as any).crypto = webcrypto;
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('NestJS bootstrapping started');
  const app = await NestFactory.create(AppModule);
  console.log('NestJS app created');

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://gitsync.vercel.app',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  await app.listen(5000, '0.0.0.0');
  console.log(`App is running at port ${process.env.PORT ?? 5000}`);
}
bootstrap();
