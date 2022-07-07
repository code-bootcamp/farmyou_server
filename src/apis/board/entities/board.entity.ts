import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() //mySQL타입을 위한
@ObjectType() //그래프 QL타입으로 읽게 만들어주는것
export class Board {
  @PrimaryGeneratedColumn('increment') //숫자를 하나씩 증가시키려면 increment를 쓰면 된다.
  @Field(() => Int) //그래프 QL타입으로 읽게 만들어주는것
  number: number;

  @Column() //mySQL타입을 위한
  @Field(() => String) //그래프 QL타입으로 읽게 만들어주는것
  writer: string;

  @Column() //mySQL타입을 위한
  @Field(() => String) //그래프 QL타입으로 읽게 만들어주는것
  title: string;

  @Column() //mySQL타입을 위한
  @Field(() => String) //그래프 QL타입으로 읽게 만들어주는것
  contents: string;
}