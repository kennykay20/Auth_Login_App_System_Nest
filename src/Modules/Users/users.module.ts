import { Module } from '@nestjs/common';
import { UsersService } from 'src/CORE/Applications/Features/users/users.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
