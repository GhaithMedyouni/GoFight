import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Athlete extends Document {
  // Section 1: Info Générale (base)
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

  // Section 1: Info Générale (détaillée)
  @Prop({ type: Object })
  infoGenerale?: {
    poids?: number;
    taille?: number;
    niveauScolaire?: string;
    categorieAge?: string;
    mainDominante?: string;
    categoriePoids?: string;
  };

  // Section 2: Niveau Sportif
  @Prop({ type: Object })
  niveauSportif?: {
    gradeCeinture?: string;
    couleurCeinture?: string;
    anneesPratique?: number;
    nombreCombats?: number;
  };

  // Section 3: Profile Physique
  @Prop({ type: Object })
  profilePhysique?: {
    forceExplosive?: number;
    vitesse?: number;
    endurance?: number;
    puissanceFrappe?: number;
    coordination?: number;
    souplesse?: number;
  };

  // Section 4: Profile Technique
  @Prop({ type: Object })
  profileTechnique?: {
    // Pour Boxing et KickBoxing
    competence?: number;
    positionGarde?: number;
    deplacement?: number;
    jabCross?: number;
    crochet?: number;
    uppercut?: number;
    esquiveBlocage?: number;
    enchainement?: number;
    timingDistance?: number;
    riposte?: number;
    coupDePied?: number; // only for kickboxing
    // Pour Crossfit
    maxPullUps?: number;
    maxPushUp?: number;
    maxAbdo?: number;
    maxBurpees?: number;
    maxGainage?: number;
    maxSquadMn?: number;
    maxPress?: number;
    maxDeadlift?: number;
    maxSquadKg?: number;
  };

  // Section 5: Données Biométriques
  @Prop({ type: Object })
  donneesBiometriques?: {
    imc?: number;
    frequenceCardiaqueRepos?: number;
    frequenceCardiaqueMax?: number;
    tauxMasseGraisse?: number;
  };

  // Section 6: Profile Mental
  @Prop({ type: Object })
  profileMental?: {
    aspect?: number;
    motivation?: number;
    discipline?: number;
    concentration?: number;
    espritEquipe?: number;
    gestionFatigueStress?: number;
  };

  // Observations
  @Prop({ type: Array })
  observationsEntraineur?: Array<{
    date?: string;
    commentaire?: string;
  }>;

  @Prop({ type: Array })
  commentairesParents?: Array<{
    date?: string;
    comportement?: string;
  }>;

  // Section 7: Objectifs
  @Prop({ type: Object })
  objectifs?: {
    objectifsList?: string[];
  };

  // Photos avant/après (6 photos max)
  @Prop([String])
  photosProgression?: string[];
}

export const AthleteSchema = SchemaFactory.createForClass(Athlete);