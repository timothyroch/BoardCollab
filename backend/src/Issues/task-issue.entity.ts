import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Task } from 'src/tasks/tasks.entity';

@Entity()
export class TaskIssue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Task, task => task.issues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column()
  github_issue_title: string;


  @Column()
  github_issue_number: number;

  @Column()
  github_repo: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
