import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin } from './admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  // Pour initialiser le premier admin manuellement
  async seedAdmin() {
    const exists = await this.adminModel.findOne({ username: 'Ziyed' });
    if (!exists) {
      const hash = await bcrypt.hash('Shankes', 10);
      await this.adminModel.create({ username: 'Ziyed', password: hash });
      console.log('✅ Admin créé avec succès');
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.adminModel.findOne({ username });
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Mot de passe invalide');

    const payload = { username: user.username, sub: user._id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}