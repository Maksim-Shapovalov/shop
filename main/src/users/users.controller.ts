import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessGuard } from 'src/auth/guard';
import { Jwt } from 'libs/common/decorators/jwt.decorator';
import { type JwtPayload } from 'libs/common/types';

@UseGuards(AccessGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Jwt() jwtPayload: JwtPayload) {
    console.log('jwtPayload', jwtPayload);
    return await this.usersService.getMe(jwtPayload.sub);
  }

  @Get(':id')
  async getById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.usersService.findById(id);
  }

  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @Param('productId', new ParseIntPipe()) productId: number,
    @Jwt() jwtPayload: JwtPayload,
  ) {
    return await this.usersService.toggleFavorite(jwtPayload.sub, productId);
  }

  @Patch(':id')
  async updateById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async deleteById(@Param('id', new ParseIntPipe()) id: number) {
    return await this.usersService.deleteById(id);
  }
}
