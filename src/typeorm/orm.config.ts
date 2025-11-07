import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { PinoTypeOrmLogger } from './typeorm.subscriber';

export const createOrmConfig = (logger: PinoLogger): TypeOrmModuleOptions => ({
  type: 'mysql', 
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production', // disable in prod
  logger: new PinoTypeOrmLogger(logger),
});
