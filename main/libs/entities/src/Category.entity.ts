import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { Product } from './Product.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  image: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @OneToMany(() => Product, (prod) => prod.category)
  products: Product[];
}
