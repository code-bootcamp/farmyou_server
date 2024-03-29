import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Admin } from 'src/apis/admin/entities/admin.entity';
import { Category } from 'src/apis/category/entities/category.entity';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';
import { File } from 'src/apis/file/entities/file.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToMany,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductDirect {
    // 직매장상품ID
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    // 제목
    @Column()
    @Field(() => String)
    title: string;

    // 내용
    // 긴 텍스트 를 넣을때는 컬럼에 텍스트라고 추가하자
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

    // 삭제여부
    @Column({default: false})
    @Field(() => Boolean)
    isDeleted: boolean;

    // 삭제일자
    @DeleteDateColumn()
    @Field(() => Date, {nullable: true})
    deletedAt: Date;

    // 수량
    @Column({ default: 0 })
    @Field(() => Int)
    quantity: number;

    // 판매량
    @Column({ default: 0 })
    @Field(() => Int)
    quantitySold: number;

    // 품절여부
    @Column({ default: false })
    @Field(() => Boolean)
    isSoldout: boolean;

    // 카테고리ID
    // @ManyToOne(() => Category, {cascade: true})
    @ManyToOne(() => Category)
    @Field(() => Category, {nullable: true})
    category: Category;

    // 직매장ID
    @ManyToOne(() => DirectStore)
    @Field(() => DirectStore, {nullable: true})
    directStore: DirectStore;

    // TODO: 구매자ID 배열로 바꾸기
    @ManyToMany(() => User, (users) => users.directProducts)
    @Field(() => [User], {nullable: true})
    users: User[];

    // 관리자ID
    @ManyToOne(() => Admin)
    @Field(() => Admin, {nullable: true})
    admin: Admin;

    // 이미지 url
    @OneToMany(() => File, (file) => file.productDirect)
    @Field((type) => [File], {nullable: true})
    files: File[];
}
