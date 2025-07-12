import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../auth/user.entity';
import { Invite } from '../invites/invite.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => User, user => user.tenants)
  members: User[];

  @ManyToOne(() => User)
  leader: User;

  @OneToMany(() => Invite, invite => invite.tenant)
  invites: Invite[];
}
