import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CategoryMain } from './entities/categoryMain.entity';
import { CategoryMainService } from './categoryMain.service';

@Resolver()
export class CategoryMainResolver {
  constructor(
    private readonly categoryMainService: CategoryMainService,
  ) {}

  @Mutation(() => CategoryMain)
  createCategoryMain(
    @Args('name') name: string, //
  ) {
    return this.categoryMainService.create({ name });
  }
}
