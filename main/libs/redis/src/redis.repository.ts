import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.factory';
import Redis from 'ioredis';

interface IRedisRepository {
  get(prefix: string, key: string): Promise<string | null>;
  getValuesByPrefix(prefix: string): Promise<(string | null)[]>;
  set(prefix: string, key: string, value: string): Promise<void>;
  delete(prefix: string, key: string): Promise<void>;
  setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void>;
  sadd(prefix: string, key: string, value: string): Promise<any>;
  srem(prefix: string, key: string, value: string): Promise<number>;
  smembers(prefix: string, key: string): Promise<string[]>;
  sismember(prefix: string, key: string, value: string): Promise<number>;
}

@Injectable()
export class RedisRepository implements IRedisRepository, OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async getValuesByPrefix(prefix: string): Promise<(string | null)[]> {
    const keys = await this.redisClient.keys(`${prefix}:*`);

    if (!keys.length) {
      return [];
    }

    const values = await this.redisClient.mget(keys);
    return values;
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  async deleteIndex() {
    try {
      await this.redisClient.call('FT.DROPINDEX', 'cities', 'DD');
      console.log('Индекс RediSearch удален успешно');
    } catch (e) {
      console.error('Ошибка удаления индекса:', e);
      throw e;
    }
  }

  // cSpell: disable-line
  sadd(prefix: string, key: string, value: string): Promise<any> {
    const redisKey = `${prefix}${key}`;
    return this.redisClient.sadd(redisKey, value);
  }

  srem(prefix: string, key: string, value: string): Promise<number> {
    const redisKey = `${prefix}${key}`;
    return this.redisClient.srem(redisKey, value);
  }

  async smembers(prefix: string, key: string): Promise<string[]> {
    const redisKey = `${prefix}${key}`;
    return await this.redisClient.smembers(redisKey);
  }

  async sismember(prefix: string, key: string, value: string): Promise<number> {
    const redisKey = `${prefix}${key}`;
    return await this.redisClient.sismember(redisKey, value);
  }
}
