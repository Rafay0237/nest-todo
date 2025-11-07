import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('todos') // 👈 Groups endpoints under "todos" in Swagger
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({ status: 200, description: 'List of all todos' })
  findAll() {
    return this.todosService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle completion of a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  toggle(@Param('id') id: number) {
    return this.todosService.toggle(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  remove(@Param('id') id: number) {
    return this.todosService.remove(id);
  }
}
