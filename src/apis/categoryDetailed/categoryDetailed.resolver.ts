import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryDetailed } from './entities/categoryDetailed.entity';
import { CategoryDetailedService } from './categoryDetailed.service';

@Resolver()
export class CategoryDetailedResolver {
  constructor(
    private readonly categoryDetailedService: CategoryDetailedService,
  ) {}

  @Mutation(() => CategoryDetailed)
  createCategoryDetailed(
    @Args('name') name: string, //
    // @Args('upperCategory') upperCategory: string
  ) {
    return this.categoryDetailedService.create({ name });
    // return this.categoryDetailedService.create({ name, upperCategory });
  }
}
