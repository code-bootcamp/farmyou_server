import { Field, ObjectType } from '@nestjs/graphql';
import { CategorySub } from 'src/apis/categorySub/entities/categorySub.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class CategoryDetailed {
  // 세부카테고리ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 이름
  @Column({ unique: true })
  @Field(() => String)
  name: string;

  // 서브카테고리ID
  @ManyToOne(() => CategorySub)
  @Field(() => CategorySub)
  categorySub: CategorySub;
}
