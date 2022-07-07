import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductUgly } from 'src/apis/productUgly/entities/productUgly.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class BoardUgly {
  // 못난이 게시판 번호
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  number: number;

  // 제목
  @Column()
  @Field(() => String)
  title: string;

  // 회원
  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  // 내용
  @Column()
  @Field(() => String)
  content: string;

  // 못난이상품
  @ManyToOne(() => ProductUgly)
  @Field(() => ProductUgly)
  productUgly: ProductUgly;
}
