import { Field,  ObjectType } from '@nestjs/graphql';
import { File } from 'src/apis/file/entities/file.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    JoinTable,
    ManyToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class Seller {
    // 회원ID
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    // 이름
    @Column()
    @Field(() => String)
    name: string;

    // 이메일
    @Column()
    @Field(() => String)
    email: string;

    // 비밀번호
    @Column()
    // @Field(() => String) 비밀번호 노출 금지!!
    password: string;

    // 전화번호
    @Column()
    @Field(() => String)
    phone: string;

    // 판매자등급
    @Column({ default: '일반셀러' })
    @Field(() => String)
    grade: string;

    // 좋아유
    @Column()
    @Field(() => Number)
    like: number;

    // 계정타입
    @Column({ default: 'seller' })
    @Field(() => String)
    type: string;

    // 회원등록날짜
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @JoinTable()
    @ManyToMany(() => User, (users) => users.sellers)
    @Field(() => [User], { nullable: true })
    users: User[];

    // 이미지 url
    @OneToMany(() => ProductUgly, (productUgly) => productUgly.seller)
    @Field((type) => [ProductUgly], {nullable: true})
    productUgly: ProductUgly[];

    // 이미지 url
    @OneToMany(() => File, (file) => file.seller)
    @Field((type) => [File], {nullable: true})
    files: File[];
}
