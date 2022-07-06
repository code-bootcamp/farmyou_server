import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity()
@ObjectType()
export class BoardDirect {
  // 직매장 게시글 번호
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  number: number;

  // 제목
  @Column()
  @Field(() => String)
  title: string;

  // 작성자
  @Column()
  @Field(() => String)
  writer: string;

  // 내용
  @Column()
  @Field(() => String)
  content: string;

  @JoinColumn()
  @OneToOne(() => ProductDirect)
  productDirect: ProductDirect;
}
