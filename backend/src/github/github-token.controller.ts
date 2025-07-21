import { Controller, Get, Post, Req, Body, UnauthorizedException } from '@nestjs/common'; 
import { IntegrationsService } from './github-token.service';


@Controller('integrations') 
export class IntegrationsController { 
constructor(private readonly integrationsService: IntegrationsService) {} 

@Get('github/repos') 

async getGitHubRepos(@Req() req) { 
const userId = req.user?.id; 
if (!userId) throw new UnauthorizedException('User not authenticated'); 
return this.integrationsService.getGitHubRepos(userId); 
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