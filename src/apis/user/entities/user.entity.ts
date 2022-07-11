import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

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

  // 회원등급
  // 좋아요 받은 횟수를 기록하는 field를 따로 넣어야 하는 지??
  @Column({ default: "일반셀러" })
  @Field(() => String)
  grade: string;

  // 좋아유
  @Column({ default: 0 })
  @Field(()=>Number)
  like: number

  // 회원등록날짜
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  // 삭제기능 
  @DeleteDateColumn()
  deletedAt: Date;
}
