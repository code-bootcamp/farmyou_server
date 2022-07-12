import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardDirect } from 'src/apis/boardDirect/entities/boardDirect.entity';
import { Category } from 'src/apis/category/entities/category.entity';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductDirect {
  // 직매장상품ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 품명 (dto)
  @Column()
  @Field(() => String)
  name: string;

  // 가격 (dto)
  @Column()
  @Field(() => Int)
  price: number;

  // 상품설명 (dto)
  @Column()
  @Field(() => String)
  description: string;

  // TODO
  // 등록날짜
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  // 수량
  @Column({default: 0})
  @Field(() => Int)
  quantity: number;

  // 판매량
  @Column({default: 0})
  @Field(() => Int)
  quantitySold: number;

  // 품절여부
  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  // 카테고리ID (dto)
  @ManyToOne(() => Category)
  @Field(() => String)
  category: Category;

  // // 직매장게시판번호
  // @ManyToOne(() => BoardDirect)
  // @Field(() => BoardDirect)
  // boardDirect: BoardDirect;

  // 직매장게시판번호
  // @ManyToOne(() => BoardDirect)
  // @Field(() => BoardDirect)
  // boardDirectId: BoardDirect;

  // 직매장ID (dto)
  @ManyToOne(() => DirectStore)
  @Field(() => String)
  directStore: DirectStore;
}
