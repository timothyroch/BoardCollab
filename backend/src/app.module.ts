import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { TenantsModule } from './tenants/tenants.module';
import { InvitesModule } from './invites/invites.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { GithubTokenModule } from './github/github-token.module';
import { TaskIssueModule } from './Issues/task-issue.module';
import { HealthController } from './health/health.controller';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') === 'development';
        return isDev
          ? {
              type: 'postgres',
              host: config.get<string>('DB_HOST', 'postgres'),
              port: parseInt(config.get<string>('DB_PORT', '5432')),
              username: config.get<string>('DB_USERNAME', 'tim'),
              password: config.get<string>('DB_PASSWORD', 'password'),
              database: config.get<string>('DB_NAME', 'boardcollab'),
              autoLoadEntities: true,
              synchronize: true,
            }
          : {
              type: 'postgres',
              url: config.get<string>('DATABASE_URL'),
              ssl: { rejectUnauthorized: false },
              autoLoadEntities: true,
              synchronize: true,
            };
      },    
    }),
    AuthModule,
    TasksModule,
    TenantsModule,
    InvitesModule,
    UsersModule,
    CommentsModule,
    GithubTokenModule,
    TaskIssueModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
