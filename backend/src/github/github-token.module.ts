import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubToken } from './github-token.entity';
import { IntegrationsController } from './github-token.controller';
import { IntegrationsService } from './github-token.service';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GithubToken, User])],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
})
export class GithubTokenModule {}
