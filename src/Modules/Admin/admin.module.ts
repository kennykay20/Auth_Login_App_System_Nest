import { Module } from '@nestjs/common';
import { AdminController } from 'src/API/Controllers/admin.controller';
//import { AdminService } from 'src/CORE/Applications/Features/Admin/admin.service';
import { UserModule } from '../User/user.module';
//import { UserService } from 'src/CORE/Applications/Features/User/user.service';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
})
export class AdminModule {}
