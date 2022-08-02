import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Seller } from 'src/apis/seller/entities/seller.entity';
import { File } from 'src/apis/file/entities/file.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToMany,
    OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductUgly {
    // 못난이상품ID
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    // 제목
    @Column()
    @Field(() => String)
    title: string;

    // 내용
    @Column('text')
    @Field(() => String)
    content: string;

    // 가격
    @Column()
    @Field(() => Int)
    price: number;

    // 등록날짜
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    // 수량
    @Column({ default: 0 })
    @Field(() => Int)
    quantity: number;

    // 판매량
    @Column({ default: 0 })
    @Field(() => Int)
    quantitySold: number;

    // 생산지
    @Column()
    @Field(() => String)
    origin: string;

    // TODO: 구매자ID 배열로 바꾸기
    @ManyToMany(() => User, (users) => users.uglyProducts)
    @Field(() => [User], { nullable: true })
    users: User[];

    // 판매자ID
    @ManyToOne(() => Seller)
    @Field(() => Seller, { nullable: true })
    seller: Seller;

    // 이미지 url
    @OneToMany(() => File, (file) => file.productUgly)
    @Field((type) => [File], {nullable: true})
    files: File[];
}
