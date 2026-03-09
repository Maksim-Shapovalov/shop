import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from 'libs/entities/src';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(data: Partial<User>) {
    const bodyForCreatingUser = this.getFakerDataForCreatingUser(data);
    return this.userRepository.save(bodyForCreatingUser);
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
}
