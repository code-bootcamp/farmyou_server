import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Inquiry } from 'src/apis/Inquiry/entities/Inquiry.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity()
@ObjectType()
export class Response {
  // 답변ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 답변내용
  @Column()
  @Field(() => String)
  content: string;

  // 작성자
  @Column()
  @Field(() => String)
  writer: string;

  // 등록일
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  // 문의ID
  @ManyToOne(() => Inquiry)
  @Field(() => Inquiry)
  inquiry: Inquiry;

  // 회원ID
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
