import { Int, ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Admin } from 'src/apis/admin/entities/admin.entity';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { Seller } from 'src/apis/seller/entities/seller.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

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
    impUid: string;

    // 액수
    @Column()
    @Field(() => Int)
    amount: number;

    // 주문수량
    @Column()
    @Field(() => Int)
    quantity: number;

    // 결제완료
    @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
    @Field(() => PAYMENT_STATUS_ENUM)
    paymentComplete: string;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    // 삭제여부
    @Column({default: false})
    @Field(() => Boolean)
    isDeleted: boolean;

    // 삭제일자
    @DeleteDateColumn()
    @Field(() => Date, {nullable: true})
    deletedAt: Date;

    // 회원
    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    // (못난이상품) 판매자
    @ManyToOne(() => Seller, {nullable: true})
    @Field(() => Seller, {nullable: true})
    seller: Seller;

    // (직매장상품) 판매자
    @ManyToOne(() => Admin, {nullable: true})
    @Field(() => Admin, {nullable: true})
    admin: Admin;

    // 직매장상품
    @ManyToOne(() => ProductDirect, {nullable: true})
    @Field(() => ProductDirect, {nullable: true})
    productDirect?: ProductDirect;

    // 못난이상품
    @ManyToOne(() => ProductUgly, {nullable: true})
    @Field(() => ProductUgly, {nullable: true})
    productUgly?: ProductUgly;

    // 송장번호
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    invoice: string;
}
