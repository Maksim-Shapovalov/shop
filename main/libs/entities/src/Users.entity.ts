import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { userRoles } from './enum';
import { Orders } from './Order.entity';
import { Product } from './Product.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'enum', enum: userRoles, default: userRoles.USER })
  role: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Product, (prod) => prod.user)
  favorites: Product[];

  @OneToMany(() => Orders, (order) => order.user)
  orders: Orders[];
}
