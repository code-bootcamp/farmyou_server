import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Payment } from "src/apis/payment/entities/payment.entity";
import { ProductDirect } from "src/apis/productDirect/entities/productDirect.entity";
import { ProductUgly } from "src/apis/productUgly/entities/productUgly.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// inputtype도 만들어야 할 수 있음 (= dto)
@Entity()
@ObjectType()
export class ItemBought {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    // // impUid (유저정보 포함)
    // @ManyToOne(() => Payment)
    // @Field(() => Payment)
    // impUid: Payment

    // 현재 아이템이 담겨있는 결제
    @ManyToOne(() => Payment)
    @Field(() => Payment)
    payment: Payment

    // 직매장상품 (수량, 가격 포함)
    @ManyToOne(() => ProductDirect, {nullable: true})
    @Field(() => ProductDirect, {nullable: true})
    productDirect?: ProductDirect;

    // 못난이상품 (수량, 가격 포함)
    @ManyToOne(() => ProductUgly, {nullable: true})
    @Field(() => ProductUgly, {nullable: true})
    productUgly?: ProductUgly;
}