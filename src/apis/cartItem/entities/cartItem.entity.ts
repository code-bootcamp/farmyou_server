import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from 'src/apis/payment/entities/payment.entity';

@Entity()
@ObjectType()
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    // impUid로 연결하기
    @ManyToOne(() => Payment)
    @Field(() => Payment)
    payment: Payment;

    
}