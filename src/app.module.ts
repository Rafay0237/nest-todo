import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: process.env.NODE_ENV === 'production'
        ? {} // disable pino-pretty in production
        : {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: true,
            },
          },
        },
    }),

    MongooseModule.forRoot(process.env.MONGO_URI as any, {
      dbName: 'todo_db',
    }),

    TodosModule,
    RedisModule,
  ],
})
export class AppModule { }
