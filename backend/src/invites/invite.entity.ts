import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @ManyToOne(() => Tenant, tenant => tenant.invites, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @ManyToOne(() => User, user => user.invitesSent, { nullable: true, onDelete: 'SET NULL' })
  inviter: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  token: string;

}
