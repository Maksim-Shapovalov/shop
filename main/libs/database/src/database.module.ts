import { Module } from '@nestjs/common';
import { DatabaseFactory } from './database.factory';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseFactory,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
