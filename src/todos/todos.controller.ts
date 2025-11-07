import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: number) {
    return this.todosService.toggle(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.todosService.remove(id);
  }
}
