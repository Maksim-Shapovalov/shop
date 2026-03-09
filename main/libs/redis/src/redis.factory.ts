import { Logger, type FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';
import type { Redis as RedisClient } from 'ioredis';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('RedisFactory');

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService): Promise<Redis> => {
    const redisInstance: RedisClient = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD', 'password'),
      db: configService.getOrThrow<number>('REDIS_DATABASE', 0),
    });

    redisInstance.on('error', (error: Error) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(`Redis connection failed: ${errorMessage}`);
      throw new Error(`Redis connection failed: ${errorMessage}`);
    });

    const pong = await redisInstance.ping();
    logger.verbose(`Redis ping response: ${pong}`);

    return redisInstance;
  },
  inject: [ConfigService],
};
