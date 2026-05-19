import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../User/user.service';
import { TaskMapper } from '../../Mappers/TaskMapper';
import { CreateTaskDto } from '../../Dtos/Task/CreateTaskDto';
import type { ITaskRepository } from '../../Persistences/ITaskRepository';
import { TaskDetailsDto } from '../../Dtos/Responses/Task/TaskDetailsDto';
import { UpdateTaskDto } from '../../Dtos/Task/UpdateTaskDto';

export const TASK_REPOSITORY = 'TASK_REPOSITORY';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private taskRepository: ITaskRepository,
    private userService: UserService,
  ) {}

  async findAllTaskForUser(userId: string): Promise<TaskDetailsDto[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const results = await this.taskRepository.findAll();
    //if (results.length == 0) return null;
    const res = results.map((data) =>
      TaskMapper.fromDomainToTaskDetailsDto(data),
    );
    return res;
  }

  async createTask(userId: string, taskCreateDto: CreateTaskDto) {
    const task = TaskMapper.toNewTask(taskCreateDto, userId);
    console.log(
      `TaskDto - title - ${task.title}, and description - ${task.description}`,
    );
    const createdTask = await this.taskRepository.create(task);
    console.log(`Task createdDate - ${createdTask.createdAt.toISOString()}`);
    return TaskMapper.fromDomainToTaskDetailsDto(createdTask);
  }

  async updateTask(
    id: string,
    userId: string,
    updatePartialDataTask: Partial<UpdateTaskDto>,
  ): Promise<TaskDetailsDto | null> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      console.log('Task not found');
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }
    if (!updatePartialDataTask) {
      console.log('No data provided for update');
      throw new NotFoundException('No data provided for update');
    }
    //const updateData
    const updatedTask = await this.taskRepository.updateTask(
      id,
      userId,
      updatePartialDataTask,
    );
    if (!updatedTask) {
      console.log('Task not updated');
      throw new BadRequestException('Task not updated');
    }
    return TaskMapper.fromDomainToTaskDetailsDto(updatedTask);
  }

  async DeleteTask(id: string, userId: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      console.log('Task not found');
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }

    await this.taskRepository.delete(id);

    return { message: 'Task deleted successfuly! ' };
  }
}
