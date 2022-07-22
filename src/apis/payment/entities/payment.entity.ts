import { Int, ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { ItemBought } from 'src/apis/itemBought/entities/itemBought.entity';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
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

    // 결제완료
    @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
    @Field(() => PAYMENT_STATUS_ENUM)
    paymentComplete: string;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    // 회원
    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

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

    @OneToMany(() => ItemBought, (itemBought) => itemBought.payment)
    @Field((type) => [ItemBought], {nullable: true})
    itemsBought: ItemBought[];
}
