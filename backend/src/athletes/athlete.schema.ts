import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Athlete extends Document {
 @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  prenom: string;

  @Prop({ required: true })
  dateNaissance: string;

  @Prop()
  numTel?: string;

  @Prop({ required: true, enum: ['KickBoxing', 'Boxing Anglaise', 'Crossfit'] })
  specialite: string;

  @Prop()
  photo?: string;
}

export const AthleteSchema = SchemaFactory.createForClass(Athlete);