import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The Email of the user',
    example: 'joe@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'The Password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
