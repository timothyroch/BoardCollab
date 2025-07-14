import { User } from './src/auth/user.entity';
import { Task } from './src/tasks/tasks.entity';
import { Tenant } from './src/tenants/tenant.entity';
import { Invite } from './src/invites/invite.entity'; 
import { DataSource } from 'typeorm';



export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'tim',
  password: 'password',
  database: 'boardcollab',
  entities: [Task, User, Tenant, Invite],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
