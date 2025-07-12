import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepo: Repository<Invite>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async sendInvite(email: string, tenantId: string, inviterId: string) {
    const inviter = await this.userRepo.findOne({ where: { id: inviterId } });
    const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });

    if (!inviter || !tenant) {
      throw new NotFoundException('Inviter or tenant not found');
    }

    const invite = this.inviteRepo.create({ email, inviter, tenant });
    return this.inviteRepo.save(invite);
  }

  async getInvitesByEmail(email: string) {
    return this.inviteRepo.find({
      where: { email },
      relations: ['tenant', 'inviter'],
      order: { createdAt: 'DESC' },
    });
  }

async acceptInvite(inviteId: string, userId: string) {
  const invite = await this.inviteRepo.findOne({
    where: { id: inviteId },
    relations: ['tenant'],
  });

  if (!invite || invite.status !== 'pending') {
    throw new NotFoundException('Invite not found or already handled');
  }

  const user = await this.userRepo.findOne({
    where: { id: userId },
    relations: ['tenants'],
  });

  if (!user) throw new NotFoundException('User not found');

  invite.status = 'accepted';
  await this.inviteRepo.save(invite);

  const alreadyMember = user.tenants.some(t => t.id === invite.tenant.id);
  if (!alreadyMember) {
    user.tenants.push(invite.tenant);
    await this.userRepo.save(user);
  }
}



  async rejectInvite(inviteId: string) {
    const invite = await this.inviteRepo.findOne({ where: { id: inviteId } });
    if (!invite || invite.status !== 'pending') {
      throw new NotFoundException('Invite not found or already handled');
    }

    invite.status = 'rejected';
    await this.inviteRepo.save(invite);
  }
}
