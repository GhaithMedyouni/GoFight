import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './athletes/athletes.module';

@Module({
  imports: [
    // ✅ Charge les variables .env globalement
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ Connexion MongoDB (locale ou Atlas selon NODE_ENV)
    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
