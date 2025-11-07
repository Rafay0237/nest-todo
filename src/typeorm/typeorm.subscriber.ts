import { PinoLogger } from 'nestjs-pino';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';

export class PinoTypeOrmLogger implements TypeOrmLogger {
  constructor(private readonly logger: PinoLogger) {}

  // Normal queries: compact one-liner
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const shortQuery = query.replace(/\s+/g, ' ').trim();
    this.logger.debug(`SQL: ${shortQuery}${parameters?.length ? ' [' + parameters.join(', ') + ']' : ''}`);
  }

  // Errors: max ~4 lines
  logQueryError(error: string | Error, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const shortQuery = query.replace(/\s+/g, ' ').trim();
    this.logger.error(
      [
        '❌ SQL Query Error',
        `Query: ${shortQuery}`,
        parameters?.length ? `Params: ${JSON.stringify(parameters)}` : undefined,
        `Error: ${typeof error === 'string' ? error : error.message}`,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  // Slow queries: short summary
  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    const shortQuery = query.replace(/\s+/g, ' ').trim();
    this.logger.warn(`🐢 Slow Query (${time} ms): ${shortQuery}`);
  }

  // Schema build or migration events: one-liner
  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    this.logger.info(`🧱 Schema: ${message}`);
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    this.logger.info(`🚀 Migration: ${message}`);
  }

  // Generic log levels
  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner) {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
      default:
        this.logger.debug(message);
    }
  }
}
