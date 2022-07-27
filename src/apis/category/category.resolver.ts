import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';

@Resolver()
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @Query(() => Category,
    { description: '카테고리 이름의 id 조회' },)
    fetchCategory(@Args('name') name: string) {
        return this.categoryService.findOne({ name });
    }

    @Query(() => [Category],
    { description: '생성한 카테고리 id, name 전부 조회' },)
    fetchCategories() {
        return this.categoryService.findAll();
    }

    @Mutation(() => Category,
    { description: '카테고리 생성' },)
    createCategory(
        @Args('name') name: string, //
    ) {
        return this.categoryService.create({ name });
    }
}
