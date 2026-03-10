import { Product } from '@entities/index';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { slugify } from 'libs/common/ utils';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) {
      return await this.search(searchTerm);
    }
    return await this.productRepository.find({ order: { createdAt: 'DESC' } });
  }

  async search(searchTerm: string) {
    return this.productRepository.find({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
    });
  }

  async getById(id: number) {
    return await this.productRepository.findOneBy({ id });
  }

  async getBySlug(slug: string) {
    return await this.productRepository.findOneBy({ slug });
  }

  async getByCategorySlug(slug: string) {
    return await this.productRepository.find({
      where: { category: { slug } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(product: CreateProductDto) {
    const slug = slugify(product.name);
    const newProduct = this.productRepository.create({ ...product, slug });
    return await this.productRepository.save(newProduct);
  }

  async update(id: number, product: UpdateProductDto) {
    const updateData: UpdateProductDto & { slug?: string } = { ...product };

    if (product.name) {
      updateData.slug = slugify(product.name);
    }
    await this.productRepository.update(id, updateData);
    return await this.getById(id);
  }

  async delete(id: number) {
    await this.productRepository.delete(id);
  }
}
