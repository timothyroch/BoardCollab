import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

async createTenant(name: string, userId: string): Promise<Tenant> {
  console.log('Creating tenant for user:', userId);
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const tenant = new Tenant();
  tenant.name = name;
  tenant.leader = user;
  tenant.members = [user];

return await this.tenantRepo.save(tenant); 
}


  async getTenantsForUser(userId: string): Promise<Tenant[]> {
    return this.tenantRepo
      .createQueryBuilder('tenant')
      .leftJoinAndSelect('tenant.members', 'member')
      .where('member.id = :userId', { userId })
      .getMany();
  }
}



