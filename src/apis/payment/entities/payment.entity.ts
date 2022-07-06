import { Int, ObjectType, Field } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Payment {
  // 주문번호
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 결제완료
  @Column({ default: false })
  @Field(() => Boolean)
  paymentComplete: boolean;

  // 회원
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  // 직매장상품
  @ManyToOne(() => ProductDirect)
  @Field(() => ProductDirect)
  productDirect?: ProductDirect;

  // 못난이상품
  @ManyToOne(() => ProductUgly)
  @Field(() => ProductUgly)
  productUgly?: ProductUgly;
}
