import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './Users.entity';

@Entity()
export class Orders extends BaseEntity {
  @Column({ unique: true })
  reference: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;
}
