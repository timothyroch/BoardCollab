import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class GithubToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('text')
  access_token: string;

  @Column({ nullable: true })
  token_type: string;

  @Column({ nullable: true })
  scope: string;

  @CreateDateColumn()
  created_at: Date;
}
