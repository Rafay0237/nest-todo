import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../typeorm/models/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(): Promise<Todo[]> {
    // 1️⃣ Try to get from cache
    const cached = await this.redisService.get('todos');
    if (cached) {
      console.log('Cache hit ✅');
      return cached as Todo[];
    }

    console.log('Cache miss ❌');
    // 2️⃣ If not found, fetch from DB
    const todos = await this.todoModel.find().exec();

    // 3️⃣ Store in Redis for 60 seconds
    await this.redisService.set('todos', todos, 60);
    return todos;
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    const result = await createdTodo.save();

    // 🧨 Invalidate cache
    await this.redisService.del('todos');
    return result;
  }

  async toggle(id: string): Promise<Todo | { message: string }> {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      return { message: 'Todo does not exist' };
    }
    todo.completed = !todo.completed;
    const result = await todo.save();

    // 🧨 Invalidate cache
    await this.redisService.del('todos');
    return result;
  }

  async remove(id: string) {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      return { deleted: false, message: 'Todo does not exist' };
    }
    await this.todoModel.findByIdAndDelete(id);

    // 🧨 Invalidate cache
    await this.redisService.del('todos');
    return { deleted: true, message: 'Todo deleted successfully' };
  }
}
