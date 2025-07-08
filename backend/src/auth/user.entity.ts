import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToMany(() => Tenant, tenant => tenant.members)
  tenants: Tenant[];
}
