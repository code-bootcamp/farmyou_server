import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

export enum CONTENT_TYPE_ENUM {
    QUESTION = 'QUESTION',
    ANSWER = 'ANSWER',
}

registerEnumType(CONTENT_TYPE_ENUM, {
    name: 'CONTENT_TYPE_ENUMM',
});

export enum INQUIRY_STATUS_ENUM {
    NOT_ANSWERED = 'NOT_ANSWERED',
    ANSWERED = 'ANSWERED',
}

registerEnumType(INQUIRY_STATUS_ENUM, {
    name: 'INQUIRY_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Inquiry {
    // 문의ID
    @PrimaryGeneratedColumn('increment')
    @Field(() => String)
    id: string;

    // 제목
    @Column()
    @Field(() => String)
    title: string;

    // 내용
    @Column()
    @Field(() => String)
    content: string;

    // 등록일
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    // 답변상태
    @Column()
    @Field(() => Boolean)
    status: boolean;

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
