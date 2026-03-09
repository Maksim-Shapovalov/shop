import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { COMPUTING_RABBIT_PROVIDER } from 'libs/common/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshTokenStrategy } from './strategies/refresh.strategies';
import { JwtAccessTokenStrategy } from './strategies/jwt.strategies';
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: COMPUTING_RABBIT_PROVIDER,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://localhost:5672',
              ),
            ],
            queue: 'COMPUTING_QUEUE',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    UsersModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtRefreshTokenStrategy, JwtAccessTokenStrategy],
})
export class AuthModule {}
