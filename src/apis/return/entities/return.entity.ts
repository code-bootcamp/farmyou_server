import { Field, ObjectType } from '@nestjs/graphql';
import { Column, JoinColumn, Entity, OneToOne } from 'typeorm';
import { Payment } from 'src/apis/payment/entities/payment.entity';

@Entity()
@ObjectType()
export class Return {
  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;

  // 취소 접수 여부
  @Column({ default: false })
  @Field(() => Boolean)
  returnRequested: boolean;

  // 취소 완료
  @Column({ default: false })
  @Field(() => Boolean)
  returnComplete: boolean;
}
