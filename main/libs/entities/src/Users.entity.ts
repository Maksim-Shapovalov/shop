import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base';
import { userRoles } from './enum';

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
}
