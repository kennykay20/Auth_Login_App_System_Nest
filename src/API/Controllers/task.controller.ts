import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTaskDto } from 'src/CORE/Applications/Dtos/Task/CreateTaskDto';
import { UpdateTaskDto } from 'src/CORE/Applications/Dtos/Task/UpdateTaskDto';
import { CurrentUser } from 'src/Shared/Common/Decorators/current-user.decorator';
import { TaskService } from 'src/CORE/Applications/Features/Task/task.service';
import { UserDetailsDto } from 'src/CORE/Applications/Dtos/Responses/User/UserDetailsDto';

@ApiTags('Task')
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  // GET: /api/v1/task
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks for current user' })
  async findAll(@CurrentUser() user: UserDetailsDto) {
    return await this.taskService.findAllTaskForUser(user.id);
  }

  // POST: /api/v1/task
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  async create(
    @CurrentUser() user: UserDetailsDto,
    @Body() dto: CreateTaskDto,
  ) {
    return await this.taskService.createTask(user.id, dto);
  }

  // PATCH: /api/v1/task/{id}
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a task' })
  async update(
    @CurrentUser() user: UserDetailsDto,
    @Param('id') id: string,
    @Body() dto: Partial<UpdateTaskDto>,
  ) {
    return await this.taskService.updateTask(id, user.id, dto);
  }

  // DELETE: /api/v1/task/{id}
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task' })
  async delete(@CurrentUser() user: UserDetailsDto, @Param('id') id: string) {
    return await this.taskService.DeleteTask(id, user.id);
  }
}
