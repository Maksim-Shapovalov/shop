import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  type TypeOrmOptionsFactory,
  type TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from 'libs/entities/src';

@Injectable()
export class DatabaseFactory implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow('DATABASE_HOST'),
      port: this.configService.getOrThrow('DATABASE_PORT'),
      username: this.configService.getOrThrow('DATABASE_USERNAME'),
      password: this.configService.getOrThrow('DATABASE_PASSWORD'),
      database: this.configService.getOrThrow('DATABASE_NAME'),
      entities: [User],
      synchronize: true,
    };
  }
}
