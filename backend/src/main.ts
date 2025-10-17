import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '300mb' }));
  app.use(urlencoded({ extended: true, limit: '300mb' }));

  // ✅ Active CORS (local + déploiement)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.100.9:3000',
      'https://gofight.vercel.app', // 🔹 ton frontend en ligne
    ],
    credentials: true,
  });

  // ✅ Port dynamique (important pour Railway)
  const port = process.env.PORT || 5000;

  // ✅ Bind sur toutes les interfaces (sinon Railway ne peut pas accéder au serveur)
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend GoFight démarré sur le port ${port}`);
}
bootstrap();
