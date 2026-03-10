import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from 'libs/entities/src';
import { OutputUserDto } from './dto/output-user.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly productService: ProductService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user ? this.usersMapper(user) : null;
  }

  async create(data: Partial<User>) {
    const bodyForCreatingUser = this.getFakerDataForCreatingUser(data);
    return this.userRepository.save(bodyForCreatingUser);
  }

  async updateById(id: number, updateUserDto: Partial<User>) {
    return this.userRepository.update(id, updateUserDto);
  }

  async getMe(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['favorites'],
    });
    return user ? this.usersMapper(user) : null;
  }

  async toggleFavorite(userId: number, productId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    const isAlreadyFavorite = user.favorites.some(
      (product) => product.id === productId,
    );
    if (isAlreadyFavorite) {
      user.favorites = user.favorites.filter(
        (product) => product.id !== productId,
      );
    } else {
      const product = await this.productService.getById(productId);
      if (!product) {
        throw new Error('Продукт не найден');
      }
      user.favorites.push(product);
    }
    await this.userRepository.save(user);
    return this.usersMapper(user);
  }

  async deleteById(id: number) {
    return this.userRepository.delete(id);
  }

  private getFakerDataForCreatingUser(data: Partial<User>) {
    return {
      avatar: data.avatar ? data.avatar : faker.image.avatar(),
      name: data.name ? data.name : faker.person.fullName(),
      phone: data.phone ? data.phone : faker.phone.number(),
      address: data.address ? data.address : faker.location.streetAddress(),
      city: data.city ? data.city : faker.location.city(),
      email: data.email ? data.email : faker.internet.email(),
      password: data.password ? data.password : faker.internet.password(),
    };
  }

  private usersMapper(user: Partial<User>): OutputUserDto {
    const { password, ...rest } = user;
    return { ...rest } as OutputUserDto;
  }
}
