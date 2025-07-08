import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => User, user => user.tenants)
  members: User[];
}
