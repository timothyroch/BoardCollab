import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InvitesService } from './invites.service';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post('send')
  async sendInvite(@Body() body: { email: string; tenantId: string; inviterId: string }) {
    return this.invitesService.sendInvite(body.email, body.tenantId, body.inviterId);
  }

  @Get()
  async getInvites(@Query('email') email: string) {
    return this.invitesService.getInvitesByEmail(email);
  }

  @Post('accept')
  async acceptInvite(@Body() body: { inviteId: string; userId: string }) {
    return this.invitesService.acceptInvite(body.inviteId, body.userId);
  }

  @Post('reject')
  async rejectInvite(@Body() body: { inviteId: string }) {
    return this.invitesService.rejectInvite(body.inviteId);
  }
}
