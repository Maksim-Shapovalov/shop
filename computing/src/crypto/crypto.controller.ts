import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { rabbitRecipient } from 'libs/common/const';
import { CryptoService } from './crypto.service';
import { ComparisonPasswordDto, GenerateTokenPairDto } from './dto';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @MessagePattern(rabbitRecipient.HASH_PASSWORD)
  async hashValue(@Payload() payload: string) {
    return { hashedPassword: await this.cryptoService.hashPassword(payload) };
  }

  @MessagePattern(rabbitRecipient.GENERATED_TOKENS)
  async generateTokens(@Payload() payload: GenerateTokenPairDto) {
    return await this.cryptoService.generateTokens(payload);
  }

  @MessagePattern(rabbitRecipient.COMPARISON_PASSWORD)
  async comparePasswords(@Payload() payload: ComparisonPasswordDto) {
    return {
      isCorrect: await this.cryptoService.comparePasswords(payload),
    };
  }

  @MessagePattern(rabbitRecipient.VERIFY_REFRESH_TOKEN)
  validateRefreshToken(@Payload() payload: { refreshToken: string }) {
    const res = this.cryptoService.validateRefreshToken(payload.refreshToken);
    return res;
  }
}
