import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Admin } from 'src/apis/admin/entities/admin.entity';
import { Category } from 'src/apis/category/entities/category.entity';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductDirect {
    // 직매장상품ID
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

    // 품절여부
    @Column({ default: false })
    @Field(() => Boolean)
    isSoldout: boolean;

    // 카테고리ID
    // @ManyToOne(() => Category, {cascade: true})
    @ManyToOne(() => Category)
    @Field(() => String)
    category: Category;

    // 직매장ID
    @ManyToOne(() => DirectStore)
    @Field(() => String)
    directStoreId: DirectStore;

    // TODO: 구매자ID 배열로 바꾸기
    @ManyToMany(() => User, (users) => users.directProducts)
    @Field(() => [User])
    users: User[];

    // 관리자ID
    @ManyToOne(() => Admin)
    @Field(() => Admin)
    adminId: Admin;
}
