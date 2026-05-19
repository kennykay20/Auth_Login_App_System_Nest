import { ITaskRepository } from 'src/CORE/Applications/Persistences/ITaskRepository';
import { Task } from 'src/Domain/Entities/Task';
import { db } from '../Db';
import { eq, and } from 'drizzle-orm';
import { tasks, type NewTask } from '../Db/schema';
//import { UserMapper } from 'src/CORE/Applications/Mappers/UserMapper';
import { Injectable } from '@nestjs/common';
import { TaskMapper } from '../../../CORE/Applications/Mappers/TaskMapper';

@Injectable()
export class TaskRepository implements ITaskRepository {
  async findByTitle(title: string): Promise<Task | null> {
    const result = await db.query.tasks.findFirst({
      where: eq(tasks.title, title),
    });
    if (!result) return null;
    return TaskMapper.toDomain(result);
  }

  async findAll(): Promise<Task[]> {
    const results = await db.query.tasks.findMany();
    return results.map((task) => TaskMapper.toDomain(task));
  }
  async findById(id: string): Promise<Task | null> {
    const result = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });
    if (!result) return null;
    return TaskMapper.toDomain(result);
  }

  async create(item: NewTask): Promise<Task> {
    console.log(
      `item for create task, title- ${item.title}, descript - ${item.description}`,
    );
    const [result] = await db.insert(tasks).values(item).returning();
    return TaskMapper.toDomain(result);
  }

  async update(id: string, item: Partial<NewTask>): Promise<Task | null> {
    const [result] = await db
      .update(tasks)
      .set({ ...item, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, item.userId!)))
      .returning();

    if (result == null) return null;
    return TaskMapper.toDomain(result);
  }

  async updateTask(
    id: string,
    userId: string,
    item: Partial<NewTask>,
  ): Promise<Task | null> {
    const [result] = await db
      .update(tasks)
      .set({ ...item, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (result == null) return null;
    return TaskMapper.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
}
