import { Module } from '@nestjs/common';
import { AuthService } from '../../CORE/Applications/Features/Auth/auth.service';
import { UserModule } from '../User/user.module';
import { EmailModule } from '../Email/email.module';

@Module({
  imports: [UserModule, EmailModule],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
