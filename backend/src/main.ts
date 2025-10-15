import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '300mb' }));
  app.use(urlencoded({ extended: true, limit: '300mb' }));

  // ✅ Active CORS pour ton frontend Next.js
  app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://192.168.100.9:3000',
  ],
  credentials: true,
});

  await app.listen(5000);
  console.log('✅ Backend NestJS sur http://localhost:5000');
}
bootstrap();