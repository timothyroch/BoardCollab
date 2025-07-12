import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Tenant } from 'src/tenants/tenant.entity';
import { Invite } from '../invites/invite.entity';


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
  @JoinTable()
  tenants: Tenant[];

@OneToMany(() => Invite, invite => invite.inviter)
invitesSent: Invite[];
}
