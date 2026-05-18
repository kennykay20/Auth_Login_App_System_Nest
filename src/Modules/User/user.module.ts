import { Module } from '@nestjs/common';
import { UserService } from '../../CORE/Applications/Features/User/user.service';
import { UserRepository } from 'src/Infrastructure/Persistence/Repositories/UserRepository';

@Module({
  imports: [],
  controllers: [],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
