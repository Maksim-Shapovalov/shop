import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GenerateTokenPairDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  role: string;
}
