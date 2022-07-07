import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CategoryDetailed } from 'src/apis/categoryDetailed/entities/categoryDetailed.entity';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';

@InputType()
export class CreateProductDirectInput {
  @Field(() => String)
  name: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => String)
  description: string;

  // 세부카테고리ID
  // @Field(() => CategoryDetailed)
  // categoryDetailed: CategoryDetailed;

  // 직매장ID
//   @Field(() => DirectStore)
//   directStore: DirectStore;
}
