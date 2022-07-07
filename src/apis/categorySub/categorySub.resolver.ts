import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CategorySub } from './entities/categorySub.entity';
import { CategorySubService } from './categorySub.service';

@Resolver()
export class CategorySubResolver {
  constructor(
    private readonly categorySubService: CategorySubService,
  ) {}

  @Mutation(() => CategorySub)
  createCategorySub(
    @Args('name') name: string, //
    @Args('upperCategory') upperCategory: string
  ) {
    return this.categorySubService.create({ name, upperCategory });
  }
}
