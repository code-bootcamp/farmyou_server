import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductDirect } from 'src/apis/productDirect/entities/productDirect.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

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

  // 회원
  @ManyToOne(() => User)
  @Field(() => User)
  writer: User;

  // 내용
  @Column()
  @Field(() => String)
  content: string;

  @JoinColumn()
  @OneToOne(() => ProductDirect)
  productDirect: ProductDirect;
}
