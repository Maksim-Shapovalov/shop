import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokensDto, RegistrationDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { type Response } from 'express';
import { Jwt } from 'libs/common/decorators/jwt.decorator';
import type { JwtPayload } from 'libs/common/types/jwtPayload.types';
import { RefreshGuard } from './guard/refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: RegistrationDto, description: 'Registration data' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'User already exists' })
  @HttpCode(HttpStatus.CREATED)
  @Post('registration')
  async registration(
    @Body() registrationDto: RegistrationDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.registration(registrationDto);
    res
      .cookie('refreshToken', result.refreshToken, { httpOnly: true })
      .status(HttpStatus.CREATED);
    res.cookie('accessToken', result.accessToken, { httpOnly: true });

    return res.send({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  @ApiOperation({ summary: 'login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiBody({ type: RegistrationDto, description: 'Login data' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);
    res
      .cookie('refreshToken', result.refreshToken, { httpOnly: true })
      .status(HttpStatus.OK);
    res.cookie('accessToken', result.accessToken, { httpOnly: true });

    return res.send({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  @ApiOperation({ summary: 'refreshToken' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBearerAuth()
  @UseGuards(RefreshGuard)
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Res() res: Response, @Jwt() payload: JwtPayload) {
    const result = await this.authService.refreshTokens({
      refreshToken: payload.refreshToken,
    } as RefreshTokensDto);

    res
      .cookie('refreshToken', result.refreshToken, { httpOnly: true })
      .status(HttpStatus.OK);
    res.cookie('accessToken', result.accessToken, { httpOnly: true });

    return res.send({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }
}
