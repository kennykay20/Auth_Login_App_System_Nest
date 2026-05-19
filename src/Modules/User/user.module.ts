import { Module } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserService,
} from '../../CORE/Applications/Features/User/user.service';
import { UserRepository } from 'src/Infrastructure/Persistence/Repositories/UserRepository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
