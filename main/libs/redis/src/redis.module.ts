import { Global, Module } from '@nestjs/common';
import { redisClientFactory } from './redis.factory';
import { RedisRepository } from './redis.repository';

@Global()
@Module({
  providers: [redisClientFactory, RedisRepository],
  exports: [redisClientFactory, RedisRepository],
})
export class RedisModule {}
