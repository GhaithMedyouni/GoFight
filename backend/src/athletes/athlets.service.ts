import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Athlete } from './athlete.schema';

@Injectable()
export class AthleteService {
  constructor(@InjectModel(Athlete.name) private athleteModel: Model<Athlete>) {}

  async create(data: any): Promise<Athlete> {
    return this.athleteModel.create(data);
  }

  async findAll(specialite?: string): Promise<Athlete[]> {
    const filter = specialite ? { specialite } : {};
    return this.athleteModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, data: any): Promise<Athlete> {
    const athlete = await this.athleteModel.findByIdAndUpdate(id, data, { new: true });
    if (!athlete) throw new NotFoundException('Athlète introuvable');
    return athlete;
  }

  async remove(id: string): Promise<void> {
    const res = await this.athleteModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Athlète introuvable');
  }
}
