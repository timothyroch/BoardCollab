import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/tasks.entity';

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

  async removeUserFromTenant(userId: string, tenantId: string): Promise<void> {
  const user = await this.userRepo.findOne({
    where: { id: userId },
    relations: ['tenants'],
  });

  if (!user) throw new Error('User not found');
  user.tenants = user.tenants.filter(t => t.id !== tenantId);
  await this.userRepo.save(user);

  const tenant = await this.tenantRepo.findOne({
    where: { id: tenantId },
    relations: ['members'],
  });

  if (!tenant) throw new Error('Tenant not found');

  tenant.members = tenant.members.filter(member => member.id !== userId);
  await this.tenantRepo.save(tenant);

}

async getTenantById(tenantId: string): Promise<Tenant | null> {
  return this.tenantRepo.findOne({
    where: { id: tenantId },
    relations: ['members', 'leader'],
  });
}


}



