import { User } from 'src/auth/user.entity';
import { Task } from 'src/tasks/tasks.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';


@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Task, task => task.comments, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;
}
