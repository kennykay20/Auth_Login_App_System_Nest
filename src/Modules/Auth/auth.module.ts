import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../../CORE/Applications/Features/Auth/auth.service';
import { UserModule } from '../User/user.module';
import { EmailModule } from '../Email/email.module';
import { AuthController } from 'src/API/Controllers/auth.controller';

@Module({
  imports: [UserModule, EmailModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
