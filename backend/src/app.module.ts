import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { TasksGateway } from './tasks/tasks.gateway';
import { User } from './auth/user.entity';
import { Tenant } from './tenants/tenant.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'tim',
      password: 'password',
      database: 'boardcollab',
      autoLoadEntities: true, 
      entities: [User, Tenant],
      synchronize: true,      
    }),
    AuthModule,
    TasksModule,
  ],
  controllers: [],
  providers: [TasksGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
