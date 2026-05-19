import { Task } from 'src/Domain/Entities/Task';
import { IRepository } from './IRepository';
import { NewTask } from 'src/Infrastructure/Persistence/Db/schema';

export interface ITaskRepository extends IRepository<Task, NewTask> {
  findByTitle(title: string): Promise<Task | null>;

  updateTask(
    id: string,
    userId: string,
    item: Partial<NewTask>,
  ): Promise<Task | null>;
}
