import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  exports: [TypeOrmModule],
})
export class TenantsModule {}
