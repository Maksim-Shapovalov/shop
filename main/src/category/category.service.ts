import { Category } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { slugify } from 'libs/common/ utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAll() {
    return await this.categoryRepository.find({ relations: ['products'] });
  }

  async getById(id: number) {
    return await this.categoryRepository.findOneBy({ id });
  }

  async getBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  async create(category: CreateCategoryDto) {
    const slug = slugify(category.name);
    const newCategory = this.categoryRepository.create({ ...category, slug });
    return await this.categoryRepository.save(newCategory);
  }

  async update(id: number, category: UpdateCategoryDto) {
    const updateData: UpdateCategoryDto & { slug?: string } = { ...category };

    if (category.name) {
      updateData.slug = slugify(category.name);
    }
    await this.categoryRepository.update(id, updateData);
    return await this.getById(id);
  }

  async delete(id: number) {
    await this.categoryRepository.delete(id);
  }
}
