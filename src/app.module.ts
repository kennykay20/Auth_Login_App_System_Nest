import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './Modules/User/user.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { EmailModule } from './Modules/Email/email.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './API/Guards/jwt-auth';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    JwtModule.register({ global: true }),
    UserModule,
    AuthModule,
    EmailModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
