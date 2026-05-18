import { IRepository } from './IRepository';
import { User } from '../../../Domain/Entities/User';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;

  findByVerificationToken(token: string): Promise<User | null>;
}
