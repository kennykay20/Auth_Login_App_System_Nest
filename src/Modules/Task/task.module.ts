import { Module } from '@nestjs/common';
import { TaskController } from 'src/API/Controllers/task.controller';
import {
  TASK_REPOSITORY,
  TaskService,
} from 'src/CORE/Applications/Features/Task/task.service';
//import { UserService } from 'src/CORE/Applications/Features/User/user.service';
import { TaskRepository } from 'src/Infrastructure/Persistence/Repositories/TaskRepository';
import { UserModule } from '../User/user.module';

@Module({
  imports: [UserModule],
  providers: [
    TaskService,
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
  ],
  controllers: [TaskController],
  exports: [],
})
export class TaskModule {}
