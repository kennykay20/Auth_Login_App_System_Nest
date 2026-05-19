import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './Modules/User/user.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { EmailModule } from './Modules/Email/email.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './API/Guards/jwt-auth';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './API/Guards/roles';
import { TaskModule } from './Modules/Task/task.module';
import { AdminModule } from './Modules/Admin/admin.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    JwtModule.register({ global: true }),
    UserModule,
    AuthModule,
    EmailModule,
    TaskModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
