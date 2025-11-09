import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createServer, IncomingMessage, ServerResponse } from 'http';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.useLogger(app.get(Logger));
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('Todo API')
      .setDescription('Simple Todo App built with NestJS and MySQL')
      .setVersion('1.0')
      .addTag('todos')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    const instance = app.getHttpAdapter().getInstance();
    cachedServer = createServer(instance);
  }
  return cachedServer;
}

// The handler Vercel expects
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const server = await bootstrapServer();
  server.emit('request', req, res);
}
