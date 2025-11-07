import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { TodosModule } from './todos/todos.module';
import { createOrmConfig } from './typeorm/orm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },

        level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',

        // ✅ Compact one-liner messages
        customSuccessMessage(req, res, responseTime) {
          return `${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms)`;
        },
        customErrorMessage(req, res, err) {
          return `❌ ${req.method} ${req.url} - ${res.statusCode || 500} (${err.message})`;
        },
        customLogLevel(req, res, err) {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },

        // ✅ Hide request/response objects in output (no res:, responseTime:)
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
            };
          },
          res() {
            return undefined; // completely hide res object
          },
          responseTime() {
            return undefined; // hide responseTime field
          }
        },

        // 👇 Prevent extra pretty-print objects under each log
        autoLogging: {
          ignore(req) {
            // optional: skip logging health checks or static files
            return req.url === '/health';
          },
        },
      },
    }),

    TypeOrmModule.forRootAsync({
      inject: [PinoLogger],
      useFactory: (logger: PinoLogger) => createOrmConfig(logger),
    }),

    TodosModule,
  ],
})
export class AppModule { }
