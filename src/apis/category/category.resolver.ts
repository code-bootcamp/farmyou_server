import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';

@Resolver()
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Query(() => Category)
  fetchCategory(
    @Args('name') name: string
  ) {
    return this.categoryService.findOne({name});
  }

  @Query(() => [Category])
  fetchCategories() {
    return this.categoryService.findAll();
  }

  @Mutation(() => Category)
  createCategory(
    @Args('name') name: string, //
  ) {
    return this.categoryService.create({ name });
  }
}
