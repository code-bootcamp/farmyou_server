import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardDirect } from 'src/apis/boardDirect/entities/boardDirect.entity';
import { CategoryDetailed } from 'src/apis/categoryDetailed/entities/categoryDetailed.entity';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductDirect {
  // 직매장상품ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 품명
  @Column()
  @Field(() => String)
  name: string;

  // 가격
  @Column()
  @Field(() => Int)
  price: number;

  // 상품설명
  @Column()
  @Field(() => String)
  description: string;

  // 등록날짜
  @Column()
  @Field(() => Date)
  createdAt: Date;

  // 수량
  @Column()
  @Field(() => Int)
  quantity: number;

  // 판매량
  @Column()
  @Field(() => Int)
  quantitySold: number;

  // 품절여부
  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  // 세부카테고리ID
  @ManyToOne(() => CategoryDetailed)
  @Field(() => CategoryDetailed)
  categoryDetailed: CategoryDetailed;

  // 직매장게시판번호
  @ManyToOne(() => BoardDirect)
  @Field(() => BoardDirect)
  boardDirect: BoardDirect;

  // 직매장ID
  @ManyToOne(() => DirectStore)
  @Field(() => DirectStore)
  directStore: DirectStore;
}
