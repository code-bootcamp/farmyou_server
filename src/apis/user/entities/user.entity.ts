import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardDirect } from 'src/apis/boardDirect/entities/boardDirect.entity';
import { BoardUgly } from 'src/apis/boardUgly/entities/boardUgly.entity';
import { Seller } from 'src/apis/seller/entities/seller.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';


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

  // 회원등록날짜
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinTable()
  @ManyToMany(() => Seller, (sellers) => sellers.users)
  @Field(() => [Seller])
  sellers: Seller[];
}
