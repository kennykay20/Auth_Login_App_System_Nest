import { Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../Persistences/IUserRepository';
import { NotFoundException } from '@nestjs/common';
import { UserDetailsDto } from '../../Dtos/Responses/User/UserDetailsDto';
import { UserMapper } from '../../Mappers/UserMapper';
import { CreateUserDto } from '../../Dtos/User/CreateUserDto';
import { User } from 'src/Domain/Entities/User';
//import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  // Implement your user-related business logic here
  constructor(private userRepository: IUserRepository) {}

  async getUserById(id: string): Promise<UserDetailsDto> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.fromDomainToUserDetailsDto(result);
  }

  async getUserByEmail(email: string): Promise<UserDetailsDto> {
    const result = await this.userRepository.findByEmail(email);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.fromDomainToUserDetailsDto(result);
  }

  async createUser(userDetails: CreateUserDto): Promise<UserDetailsDto> {
    const user = UserMapper.toDomainFromCreateUserDto(userDetails);
    const createdUser = await this.userRepository.create(user);
    return UserMapper.fromDomainToUserDetailsDto(createdUser);
  }

  async updateUser(
    userId: string,
    updatePartialDataUser: Partial<User>,
  ): Promise<UserDetailsDto | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!updatePartialDataUser) {
      throw new NotFoundException('No data provided for update');
    }
    //const updateData = UserMapper.toPartialDbUser(updatePartialDataUser);
    const updatedUser = await this.userRepository.update(
      userId,
      updatePartialDataUser,
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.fromDomainToUserDetailsDto(updatedUser);
  }
}
