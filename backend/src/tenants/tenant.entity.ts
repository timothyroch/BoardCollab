import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../auth/user.entity';
import { Invite } from '../invites/invite.entity';
import { Task } from 'src/tasks/tasks.entity';

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


@OneToMany(() => Task, task => task.tenant)
tasks: Task[];
}
