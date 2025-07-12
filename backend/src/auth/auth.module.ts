import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([User, Tenant]), 
    PassportModule,  // Enables use of AuthGuard('jwt')
    JwtModule.register({
      secret: process.env.JWT_SECRET,  
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
