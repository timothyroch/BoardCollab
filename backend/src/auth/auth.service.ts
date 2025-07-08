import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Tenant } from '../tenants/tenant.entity'; // Adjust the import path as needed

@Injectable()
export class AuthService {
     constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async resolveUser(data: { email: string; name?: string; image?: string }) {
    let user = await this.userRepository.findOne({
      where: { email: data.email },
      relations: ['tenants'], // preload memberships
    });

    if (!user) {
            // Create new tenant
    const tenant = this.tenantRepository.create({
      name: `${data.name || 'Personal'} Workspace`,
    });
    await this.tenantRepository.save(tenant);

      user = this.userRepository.create({
        email: data.email,
        name: data.name,
        image: data.image,
        tenants: [tenant],
      });

      await this.userRepository.save(user);
    }

    return {
      userId: user.id,
      tenants: user.tenants.map(t => ({ id: t.id, name: t.name })),
    };
  }
}
