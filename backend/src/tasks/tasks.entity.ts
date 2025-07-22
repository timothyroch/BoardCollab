import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Comment } from '../comments/comment.entity';
import { TaskIssue } from 'src/Issues/task-issue.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, { nullable: true })
  creator: User;

  @ManyToMany(() => User)
  @JoinTable()
  assignees: User[];


  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];

  @Column({
  type: 'enum',
  enum: ['to_do', 'in_progress', 'done'],
  default: 'to_do',
})
status: 'to_do' | 'in_progress' | 'done';

@OneToMany(() => TaskIssue, issue => issue.task, { cascade: true })
issues: TaskIssue[];

}
