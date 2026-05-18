import { User } from '../../../Domain/Entities/User';
import { DbUser } from '../../../Infrastructure/Persistence/Db/schema';
export class UserMapper {
  static toDomain(result: DbUser): User {
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      passwordHash: result.passwordHash,
      role: result.role,
      isVerified: result.isVerified,
      verificationToken: result.verificationToken,
      verificationTokenExpiresAt: result.verificationTokenExpiresAt,
      resetToken: result.resetToken,
      resetTokenExpiresAt: result.resetTokenExpiresAt,
      refreshTokenHash: result.refreshTokenHash,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
