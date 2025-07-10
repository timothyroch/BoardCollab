import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

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
}
