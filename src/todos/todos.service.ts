import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepo: Repository<Todo>,
  ) {}

  findAll(): Promise<Todo[]> {
    return this.todosRepo.find();
  }

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepo.create(createTodoDto);
    return this.todosRepo.save(todo);
  }

  async toggle(id: number): Promise<Todo> {
    const todo = await this.todosRepo.findOneBy({ id });
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = !todo.completed;
    return this.todosRepo.save(todo);
  }

  async remove(id: number) {
    await this.todosRepo.delete(id);
    return { deleted: true };
  }
}
