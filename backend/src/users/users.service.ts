import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUsersByTenant(tenantId: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.tenants', 'tenant')
      .where('tenant.id = :tenantId', { tenantId })
      .select(['user.id', 'user.email', 'user.name'])
      .getMany();
  }
}
