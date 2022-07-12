import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardDirect } from 'src/apis/boardDirect/entities/boardDirect.entity';
import { BoardUgly } from 'src/apis/boardUgly/entities/boardUgly.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  // 회원ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 이메일
  @Column()
  @Field(() => String)
  email: string;

  // 이름
  @Column()
  @Field(() => String)
  name: string;

  // 비밀번호
  @Column()
  // @Field(() => String) 비밀번호 노출 금지!!
  password: string;

  // 연락처
  @Column()
  @Field(() => String)
  phone: string;

  // 판매자
  @Column({ default: false })
  @Field(() => Boolean)
  isSeller: boolean;

  // 판매자에만 해당 (아래의 like 횟수에 따라 등급 판별됨)
  // 판매자등급
  @Column({ default: "일반셀러" })
  @Field(() => String)
  grade: string;

  // 판매자에만 해당
  // 좋아유
  @Column({ default: 0 })
  @Field(() => Number)
  like: number

  // 회원등록날짜
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;


  // 삭제기능 
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => BoardDirect, boardDirect => boardDirect.writer)
  @Field(() => Number)
  boardDirectNum: BoardDirect[];

  @OneToMany(() => BoardUgly, boardUgly => boardUgly.writer)
  @Field(() => Number)
  boardUglyNum: BoardUgly[];

}
