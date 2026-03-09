import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductionModule } from './production/production.module';
import { DatabaseModule } from 'libs/database/src/database.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from 'libs/redis/src/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    RedisModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductionModule,
  ],
})
export class AppModule {}
