import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
     constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async resolveUser(data: { email: string; name?: string; image?: string }) {
    let user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ['tenants'], // preload memberships
    });

    if (!user) {
      user = this.userRepository.create({
        email: data.email,
        name: data.name,
        image: data.image,
        tenants: [],
      });

      await this.userRepository.save(user);
    }

    return {
      userId: user.id,
      tenants: user.tenants.map(t => ({ id: t.id, name: t.name })),
    };
  }
}
