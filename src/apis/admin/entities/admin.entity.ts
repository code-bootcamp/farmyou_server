import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';
import { Seller } from 'src/apis/seller/entities/seller.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinTable, ManyToMany, JoinColumn, OneToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Admin {
  // 회원ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 이메일
  @Column()
  @Field(() => String)
  email: string;

  // 비밀번호
  @Column()
  // @Field(() => String) 비밀번호 노출 금지!!
  password: string;

  // 등록날짜
  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinColumn()
  @OneToOne(() => DirectStore)
  @Field(() => String)
  directStore: DirectStore;
}
