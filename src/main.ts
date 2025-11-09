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

    // ✅ Enable CORS for frontend + local dev
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // ✅ Swagger setup using CDN for Vercel compatibility
    const config = new DocumentBuilder()
      .setTitle('Todo API')
      .setDescription('Simple Todo App built with NestJS and MySQL')
      .setVersion('1.0')
      .addTag('todos')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document, {
      customJs: [
        'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
      ],
      customCssUrl: [
        'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
      ],
    });

    await app.init();

    // Get the underlying HTTP instance for Vercel
    const instance = app.getHttpAdapter().getInstance();
    cachedServer = createServer(instance);
  }
  return cachedServer;
}

// ✅ The Vercel serverless handler
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const server = await bootstrapServer();
  server.emit('request', req, res);
}
