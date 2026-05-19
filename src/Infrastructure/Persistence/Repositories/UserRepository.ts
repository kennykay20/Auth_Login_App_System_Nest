import { IUserRepository } from '../../../CORE/Applications/Persistences/IUserRepository';
import { User } from '../../../Domain/Entities/User';
import { db } from '../Db';
import { eq } from 'drizzle-orm';
import { users, type NewUser } from '../Db/schema';
import { UserMapper } from 'src/CORE/Applications/Mappers/UserMapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (result == null) return null;
    else {
      return UserMapper.toDomain(result);
    }
  }
  async findAll(): Promise<User[]> {
    const results = await db.query.users.findMany();
    return results.map((data) => UserMapper.toDomain(data));
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (result == null) return null;
    else {
      return UserMapper.toDomain(result);
    }
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    });
    if (result == null) return null;
    return UserMapper.toDomain(result);
  }

  async findByResetToken(token: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(users.resetToken, token),
    });
    if (result == null) return null;
    return UserMapper.toDomain(result);
  }

  async create(item: NewUser): Promise<User> {
    console.log(`item for create email- ${item.email}`);
    const [result] = await db.insert(users).values(item).returning();
    return UserMapper.toDomain(result);
  }

  async update(id: string, item: Partial<NewUser>): Promise<User | null> {
    const [result] = await db
      .update(users)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (result == null) return null;
    return UserMapper.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
