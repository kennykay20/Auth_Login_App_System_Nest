import { Module } from '@nestjs/common';
import { UserService } from '../../CORE/Applications/Features/User/user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
