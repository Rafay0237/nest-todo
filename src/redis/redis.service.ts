import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: any, ttlSeconds = 60) {
    return this.redis.set(key, value, { ex: ttlSeconds });
  }

  async del(key: string) {
    return this.redis.del(key);
  }
}
