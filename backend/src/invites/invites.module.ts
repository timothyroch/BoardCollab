import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invite, Tenant, User])],
  providers: [InvitesService],
  controllers: [InvitesController],
})
export class InvitesModule {}
