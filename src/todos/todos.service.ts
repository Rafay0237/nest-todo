// src/todos/todos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../typeorm/models/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoModel.find().exec();
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }

  async toggle(id: string): Promise<Todo | { message: string }> {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      return { message: 'Todo does not exist' };
    }
    todo.completed = !todo.completed;
    return todo.save();
  }

  async remove(id: string) {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      return { deleted: false, message: 'Todo does not exist' };
    }
    await this.todoModel.findByIdAndDelete(id);
    return { deleted: true, message: 'Todo deleted successfully' };
  }
}
