import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Athlete } from './athlete.schema';

@Injectable()
export class AthleteService {
  constructor(@InjectModel(Athlete.name) private athleteModel: Model<Athlete>) { }

  async create(data: any): Promise<Athlete> {
    return this.athleteModel.create(data);
  }

  async findAll(specialite?: string): Promise<Athlete[]> {
    const filter = specialite ? { specialite } : {};
    return this.athleteModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  // Dans athlets.service.ts
  async update(id: string, data: any): Promise<Athlete> {
    console.log('📝 Données reçues pour update:', JSON.stringify(data, null, 2));

    const athlete = await this.athleteModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: false } // Désactiver les validateurs pour les champs optionnels
    );

    if (!athlete) throw new NotFoundException('Athlète introuvable');

    console.log('✅ Athlète mis à jour:', JSON.stringify(athlete, null, 2));
    return athlete;
  }

  async remove(id: string): Promise<void> {
    const res = await this.athleteModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Athlète introuvable');
  }
  // Dans athlets.service.ts
  async findOne(id: string): Promise<Athlete> {
    const athlete = await this.athleteModel.findById(id).exec();
    if (!athlete) throw new NotFoundException('Athlète introuvable');
    console.log('🔍 Athlète récupéré:', JSON.stringify(athlete, null, 2));
    return athlete;
  }
}
