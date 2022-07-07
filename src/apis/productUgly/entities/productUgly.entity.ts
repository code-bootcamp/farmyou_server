import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardUgly } from 'src/apis/boardUgly/entities/boardUgly.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity()
@ObjectType()
export class ProductUgly {
  // 못난이상품ID
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
  @CreateDateColumn()
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

  // 생산지
  @Column()
  @Field(() => String)
  area: string;

  // 품절여부
  @Column({ default: false })
  @Field(() => Boolean)
  isSoldout: boolean;

  // 못난이게시판번호
  @ManyToOne(() => BoardUgly)
  @Field(() => BoardUgly)
  boardUgly: BoardUgly;
}
