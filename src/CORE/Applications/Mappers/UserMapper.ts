import { User } from '../../../Domain/Entities/User';
import { DbUser, NewUser } from '../../../Infrastructure/Persistence/Db/schema';
import { UserDetailsDto } from '../Dtos/Responses/User/UserDetailsDto';
import { CreateUserDto } from '../Dtos/User/CreateUserDto';
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

  static fromDomainToUserDetailsDto(user: User): UserDetailsDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      passwordHash: user.passwordHash,
      verificationToken: user.verificationToken,
      verificationTokenExpiresAt: user.verificationTokenExpiresAt,
      resetToken: user.resetToken,
      resetTokenExpiresAt: user.resetTokenExpiresAt,
      refreshTokenHash: user.refreshTokenHash,
    };
  }

  static toDomainFromCreateUserDto(createUserDto: CreateUserDto): User {
    return {
      id: '',
      name: createUserDto.name!,
      email: createUserDto.email!,
      passwordHash: createUserDto.passwordHash!,
      role: 'user',
      isVerified: false,
      verificationToken: null,
      verificationTokenExpiresAt: null,
      resetToken: null,
      resetTokenExpiresAt: null,
      refreshTokenHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toNewUser(createUserDto: CreateUserDto): NewUser {
    return {
      name: createUserDto.name!,
      email: createUserDto.email!,
      passwordHash: createUserDto.passwordHash!,
      role: 'user',
      isVerified: false,
      verificationToken: null,
      verificationTokenExpiresAt: null,
      resetToken: null,
      resetTokenExpiresAt: null,
      refreshTokenHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static toPartialDbUser(user: Partial<User>): Partial<NewUser> {
    return {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      isVerified: user.isVerified,
      verificationToken: user.verificationToken,
      verificationTokenExpiresAt: user.verificationTokenExpiresAt,
      refreshTokenHash: user.refreshTokenHash,
      resetToken: user.resetToken,
      resetTokenExpiresAt: user.resetTokenExpiresAt,
    };
  }
}
