import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';
import { randomUUID } from 'crypto';
import { MailerService } from '../mailer/email.service';

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

console.log('[InvitesService] Checking user existence for:', email);
const existingUser = await this.userRepo.findOne({ where: { email } });

if (existingUser) {
  console.log('[InvitesService] User exists, skipping email.');
  const invite = this.inviteRepo.create({ email, inviter, tenant });
  await this.inviteRepo.save(invite);
  return { alreadyRegistered: true, message: 'User exists; invite created' };
}

console.log('[InvitesService] User does not exist, preparing to send email...');

  
  const token = randomUUID(); 

  const invite = this.inviteRepo.create({
    email,
    inviter,
    tenant,
    status: 'pending',
    token,
  });

  await this.inviteRepo.save(invite);

  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

  await MailerService.sendInviteEmail(email, inviter.name, tenant.name, inviteLink);

  return { alreadyRegistered: false, message: 'Email invite sent' };
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

async acceptInviteByEmail(email: string, userId: string) {
  const invite = await this.inviteRepo.findOne({
    where: { email, status: 'pending' },
    relations: ['tenant'],
    order: { createdAt: 'DESC' }, 
  });

  if (!invite) throw new NotFoundException('No pending invite found for this email');

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

  return { message: 'Invite accepted and tenant assigned' };
}

async getInviteByToken(token: string) {
  const invite = await this.inviteRepo.findOne({
    where: { token },
    relations: ['tenant'],
  });

  if (!invite) throw new NotFoundException('Invite not found');
  return invite;
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
