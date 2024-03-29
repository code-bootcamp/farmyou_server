import { Field, ObjectType } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { File } from 'src/apis/file/entities/file.entity';
import { Seller } from 'src/apis/seller/entities/seller.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
} from 'typeorm';
import { AddressUser } from 'src/apis/addressUser/entities/addressUser.entity';

@Entity()
@ObjectType()
export class User {
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

    // 연락처
    @Column()
    @Field(() => String)
    phone: string;

    // 계정타입
    @Column({ default: 'user' })
    @Field(() => String)
    type: string;

    // 회원등록날짜
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    // 유저 주소
    @OneToMany(() => AddressUser, (address) => address.user)
    @Field((type) => [AddressUser], {nullable: true})
    address: AddressUser[];

    @ManyToMany(() => Seller, (sellers) => sellers.users)
    @Field(() => [Seller], { nullable: true })
    sellers: Seller[];

    @JoinTable()
    @ManyToMany(() => ProductDirect, (directProducts) => directProducts.users)
    @Field(() => [ProductDirect], { nullable: true })
    directProducts: ProductDirect[];

    @JoinTable()
    @ManyToMany(() => ProductUgly, (uglyProducts) => uglyProducts.users)
    @Field(() => [ProductUgly], { nullable: true })
    uglyProducts: ProductUgly[];

    // 이미지 url
    @OneToMany(() => File, (file) => file.user)
    @Field((type) => [File], {nullable: true})
    files: File[];
}
