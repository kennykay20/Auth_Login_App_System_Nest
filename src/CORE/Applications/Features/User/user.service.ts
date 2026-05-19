import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../Persistences/IUserRepository';
import { NotFoundException } from '@nestjs/common';
import { UserDetailsDto } from '../../Dtos/Responses/User/UserDetailsDto';
import { UserMapper } from '../../Mappers/UserMapper';
import { CreateUserDto } from '../../Dtos/User/CreateUserDto';
import { User } from '../../../../Domain/Entities/User';
//import { Injectable } from '@nestjs/common';
export const USER_REPOSITORY = 'USER_REPOSITORY';

@Injectable()
export class UserService {
  // Implement your user-related business logic here

  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async findAllUser(): Promise<UserDetailsDto[]> {
    const results = await this.userRepository.findAll();
    return results.map((data) => UserMapper.fromDomainToUserDetailsDto(data));
  }
  async getUserById(id: string): Promise<UserDetailsDto> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }
    return UserMapper.fromDomainToUserDetailsDto(result);
  }

  async findUserById(id: string): Promise<UserDetailsDto | null> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      return null;
    }
    return UserMapper.fromDomainToUserDetailsDto(result);
  }

  async findUserByEmail(email: string): Promise<UserDetailsDto | null> {
    console.log('inside the getUserByemail method repo');
    const result = await this.userRepository.findByEmail(email);
    if (!result) {
      console.log('user not found');
      return null;
    }
    return UserMapper.fromDomainToUserDetailsDto(result);
  }

  async getUserByEmail(email: string): Promise<UserDetailsDto> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }

    return UserMapper.fromDomainToUserDetailsDto(user);
  }

  async findUserByVerificationToken(
    token: string,
  ): Promise<UserDetailsDto | null> {
    const result = await this.userRepository.findByVerificationToken(token);
    if (!result) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }
    return UserMapper.fromDomainToUserDetailsDto(result);
  }

  async findUserByResetToken(token: string) {
    const result = await this.userRepository.findByResetToken(token);
    if (!result) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }
    return UserMapper.fromDomainToUserDetailsDto(result);
  }

  async createUser(userDetails: CreateUserDto): Promise<UserDetailsDto> {
    const user = UserMapper.toNewUser(userDetails);
    console.log(
      `userDto - email - ${user.email}, and verificationToken - ${user.verificationToken}`,
    );
    const createdUser = await this.userRepository.create(user);
    console.log(`user createdDate - ${createdUser.createdAt.toISOString()}`);
    return UserMapper.fromDomainToUserDetailsDto(createdUser);
  }

  async updateUser(
    userId: string,
    updatePartialDataUser: Partial<User>,
  ): Promise<UserDetailsDto | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }
    if (!updatePartialDataUser) {
      console.log('No data provided for update');
      throw new NotFoundException('No data provided for update');
    }
    //const updateData = UserMapper.toPartialDbUser(updatePartialDataUser);
    const updatedUser = await this.userRepository.update(
      userId,
      updatePartialDataUser,
    );
    if (!updatedUser) {
      console.log('User not updated');
      throw new BadRequestException('User not updated');
    }
    return UserMapper.fromDomainToUserDetailsDto(updatedUser);
  }

  async DeleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      console.log('User not found');
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return { message: 'User deleted successfuly! ' };
  }
}
