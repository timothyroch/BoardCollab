import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GithubToken } from './github-token.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(GithubToken)
    private readonly githubTokenRepo: Repository<GithubToken>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async saveGithubToken(userId: string, access_token: string, token_type?: string, scope?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.githubTokenRepo.delete({ user });

    const newToken = this.githubTokenRepo.create({ user, access_token, token_type, scope });
    await this.githubTokenRepo.save(newToken);

    return { message: 'GitHub token saved successfully' };
  }

  async getGitHubRepos(userId: string) {
    const token = await this.githubTokenRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    if (!token || !token.access_token) {
      throw new NotFoundException('GitHub token not found');
    }

    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${token.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${error}`);
    }

    return response.json();
  }
}