import { Controller, Get, Post, Req, Body, UnauthorizedException } from '@nestjs/common'; 
import { IntegrationsService } from './github-token.service';


@Controller('integrations') 
export class IntegrationsController { 
constructor(private readonly integrationsService: IntegrationsService) {} 

@Get('github/repos')
async getGitHubRepos(@Req() req) {
  const userId = req.query.userId;
  if (!userId) throw new UnauthorizedException('Missing userId');
  return this.integrationsService.getGitHubRepos(userId);
}

@Get('github/issues')
async getGitHubIssues(@Req() req) {
  const userId = req.query.userId;
  const repo = req.query.repo;

  if (!userId || !repo) {
    throw new UnauthorizedException('Missing userId or repo');
  }

  return this.integrationsService.getGitHubIssues(userId, repo);
}


@Post('save-github-token')
async saveGithubToken(
  @Body() body: {
    userId: string;
    githubAccessToken: string;
    tokenType?: string;
    scope?: string;
  },
) {
  return this.integrationsService.saveGithubToken(
    body.userId,
    body.githubAccessToken,
    body.tokenType,
    body.scope
  );
}


} 