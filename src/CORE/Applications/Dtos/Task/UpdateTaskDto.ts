import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Build auth system' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Implement JWT with refresh tokens',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // @ApiProperty({
  //   example: 'Status to todo or complete',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // status?: string;
}
