import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Tenant } from '../tenants/tenant.entity'; 
import { Invite } from '../invites/invite.entity'; 

@Injectable()
export class AuthService {
     constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
  ) {}

async resolveUser(data: { email: string; name?: string; image?: string }) {
  let user = await this.userRepository.findOne({
    where: { email: data.email },
    relations: ['tenants'],
  });

  if (!user) {
    const pendingInvite = await this.inviteRepo.findOne({
      where: { email: data.email, status: 'pending' },
      relations: ['tenant'],
      order: { createdAt: 'DESC' },
    });

let tenant: Tenant | null;

if (pendingInvite) {
  pendingInvite.status = 'accepted';
  await this.inviteRepo.save(pendingInvite);
  tenant = pendingInvite.tenant;
} else {
  tenant = await this.tenantRepository.findOne({ where: { name: 'Your workspace' } });
  if (!tenant) {
    tenant = this.tenantRepository.create({ name: 'your workspace' });
    await this.tenantRepository.save(tenant);
  }
}

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
