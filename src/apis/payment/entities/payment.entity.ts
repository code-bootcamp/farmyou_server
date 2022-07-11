import { Int, ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


export enum PAYMENT_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

registerEnumType(PAYMENT_STATUS_ENUM, {
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  // 주문번호
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string

  // 액수
  @Column()
  @Field(() => Int)
  amount: number;

  // 결제완료
  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM)
  paymentComplete: string;

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
