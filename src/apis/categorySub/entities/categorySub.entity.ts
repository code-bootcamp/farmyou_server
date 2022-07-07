import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CategoryMain } from 'src/apis/categoryMain/entities/categoryMain.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
// @InputType()
export class CategorySub {
  // 서브카테고리ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 이름
  @Column({ unique: true })
  @Field(() => String)
  name: string;

  // 메인카테고리ID
  @ManyToOne(() => CategoryMain)
  @Field(() => CategoryMain)
  categoryMain: CategoryMain;
}
