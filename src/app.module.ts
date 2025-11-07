import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root123', // 🔒 your MySQL password
      database: 'todo_db',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ auto sync tables (for dev only)
    }),
    TodosModule,
  ],
})
export class AppModule {}
