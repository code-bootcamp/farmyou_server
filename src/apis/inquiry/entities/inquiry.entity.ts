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
    DeleteDateColumn,
} from 'typeorm';

// export enum CONTENT_TYPE_ENUM {
//     QUESTION = 'QUESTION',
//     ANSWER = 'ANSWER',
// }

// registerEnumType(CONTENT_TYPE_ENUM, {
//     name: 'CONTENT_TYPE_ENUMM',
// });

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

    // 질문제목
    @Column()
    @Field(() => String)
    title: string;

    // 질문내용
    @Column({nullable: true})
    @Field(() => String)
    question: string;

    // 답변제목
    @Column({nullable: true})
    @Field(() => String)
    answerTitle: string;

    // 답변내용
    @Column({nullable: true})
    @Field(() => String)
    answer: string;

    // 등록일자
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    // 답변상태
    @Column({ type: 'enum', enum: INQUIRY_STATUS_ENUM })
    @Field(() => INQUIRY_STATUS_ENUM)
    status: string;

    // 회원
    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @Column({default: false})
    @Field(() => Boolean)
    isDeleted: boolean;

    // 삭제일자
    @DeleteDateColumn()
    @Field(() => Date)
    deletedAt: Date;

    // 직매장상품
    @ManyToOne(() => ProductDirect)
    @Field(() => ProductDirect)
    productDirect?: ProductDirect;

    // 못난이상품
    @ManyToOne(() => ProductUgly)
    @Field(() => ProductUgly)
    productUgly?: ProductUgly;
}
