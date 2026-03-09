import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GenerateTokenPairDto,
  LoginDto,
  RefreshTokensDto,
  RegistrationDto,
} from './dto';
import { UsersService } from 'src/users/users.service';
import { ClientProxy } from '@nestjs/microservices';
import { COMPUTING_RABBIT_PROVIDER, rabbitSender } from 'libs/common/constants';
import { firstValueFrom } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RedisRepository } from '@redis/redis.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(COMPUTING_RABBIT_PROVIDER) private readonly rabbitMq: ClientProxy,
    private readonly redisRepository: RedisRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async registration(registrationDto: RegistrationDto) {
    const { email, password } = registrationDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    const hashResult: { hashedPassword: string } = await firstValueFrom(
      this.rabbitMq.send(rabbitSender.HASH_PASSWORD, password),
    );
    const createdUser = await this.usersService.create({
      email,
      password: hashResult.hashedPassword,
    });

    const { accessToken, refreshToken } = await this.generateTokensPair({
      userId: createdUser.id,
      role: createdUser.role,
    });

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (!existingUser) {
      throw new ConflictException('Пользователь с таким email не найден');
    }

    const comparisonPassword: { isCorrect: boolean } = await firstValueFrom(
      this.rabbitMq.send(rabbitSender.COMPARISON_PASSWORD, {
        hash: existingUser.password,
        password,
      }),
    );
    if (!comparisonPassword.isCorrect) {
      throw new BadRequestException('Неверный пароль');
    }

    const { accessToken, refreshToken } = await this.generateTokensPair({
      userId: existingUser.id,
      role: existingUser.role,
    });
    return { accessToken, refreshToken };
  }

  async refreshTokens(dto: RefreshTokensDto) {
    console.log(dto);
    const result = await firstValueFrom(
      this.rabbitMq.send(rabbitSender.VERIFY_REFRESH_TOKEN, {
        refreshToken: dto.refreshToken,
      }),
    );
    if (!result) {
      throw new BadRequestException('Неверный токен обновления');
    }
    const user = await this.usersService.findById(Number(result.sub));
    if (!user) {
      throw new UnauthorizedException();
    }
    const { accessToken, refreshToken } = await this.generateTokensPair({
      userId: user.id,
      role: user.role,
    });
    return { accessToken, refreshToken };
  }

  private async generateTokensPair(payload: GenerateTokenPairDto) {
    const generatedTokenPair: { accessToken: string; refreshToken: string } =
      await firstValueFrom(
        this.rabbitMq.send(rabbitSender.GENERATED_TOKENS, payload),
      );

    return generatedTokenPair;
  }
}
