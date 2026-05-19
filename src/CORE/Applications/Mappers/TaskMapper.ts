import { CreateTaskDto } from '../Dtos/Task/CreateTaskDto';
import { Task } from 'src/Domain/Entities/Task';
import { DbTask, NewTask } from 'src/Infrastructure/Persistence/Db/schema';
import { TaskDetailsDto } from '../Dtos/Responses/Task/TaskDetailsDto';

export class TaskMapper {
  static toDomain(result: DbTask): Task {
    return {
      id: result.id,
      title: result.title,
      description: result.description,
      status: result.status,
      userId: result.userId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  static toNewTask(createTaskDto: CreateTaskDto, userId: string): NewTask {
    return {
      title: createTaskDto.title,
      description: createTaskDto.description,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static fromDomainToTaskDetailsDto(task: Task): TaskDetailsDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
