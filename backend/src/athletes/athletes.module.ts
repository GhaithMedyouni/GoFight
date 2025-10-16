import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Athlete, AthleteSchema } from './athlete.schema';
import { AthletesController } from './athltes.controller';
import { AthleteService } from './athlets.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Athlete.name, schema: AthleteSchema  }])],
  controllers: [AthletesController],
  providers: [AthleteService],
})
export class UsersModule {}
