import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { ProductUgly } from './entities/productUgly.entity';
import { ProductUglyService } from './productUgly.service';

@Resolver()
export class ProductUglyResolver {
  constructor(private readonly productUglyService: ProductUglyService) {}

  @Query(() => [ProductUgly])
  fetchUglyProducts() {
    return this.productUglyService.findAll();
  }

  @Query(() => ProductUgly)
  fetchUglyProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productUglyService.findOne({ productId });
  }

  @Mutation(() => ProductUgly)
  createProductUgly(
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('price') price: number,
    @Args('quantity') quantity: number,
    @Args('origin') origin: string,
    @Args('sellerId') sellerId: string,
    // @CurrentUser() currentUser: ICurrentUser
  ) {
    return this.productUglyService.create({ title, content, price, quantity, origin, sellerId });
  }
  
  // 수량이 0개 되었을 때
  @Mutation(() => Boolean)
  deleteProductUgly(
    @Args('productId') productId: string, //
  ) {
    return this.productUglyService.delete({ productId });
  }
}
