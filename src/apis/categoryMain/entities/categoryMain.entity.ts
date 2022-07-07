import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
// @InputType()
export class CategoryMain {
  // 메인카테고리ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 이름
  @Column({ unique: true })
  @Field(() => String)
  name: string;
}
