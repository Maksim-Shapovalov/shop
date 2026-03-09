import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokensDto {
  @ApiProperty({
    description: 'рефреш токен',
    example: '',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
