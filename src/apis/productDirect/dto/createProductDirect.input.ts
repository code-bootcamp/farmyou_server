import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Category } from 'src/apis/category/entities/category.entity';
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

  // 카테고리ID
  @Field(() => String)
  categoryId: Category;

  // 직매장ID
  @Field(() => String)
  directStoreId: DirectStore;
}
