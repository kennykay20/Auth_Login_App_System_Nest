import { IRepository } from './IRepository';
import { User } from '../../../Domain/Entities/User';
import { NewUser } from '../../../Infrastructure/Persistence/Db/schema';

export interface IUserRepository extends IRepository<User, NewUser> {
  findByEmail(email: string): Promise<User | null>;

  findByVerificationToken(token: string): Promise<User | null>;

  findByResetToken(token: string): Promise<User | null>;
}
