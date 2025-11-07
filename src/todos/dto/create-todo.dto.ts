import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'Learn NestJS', description: 'Title of the todo item' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
