import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateProductUglyInput } from './dto/createProductUgly.input';
import { UpdateProductUglyInput } from './dto/updateProductUgly.input';
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

  // @Mutation(() => ProductUgly)
  // createProductUgly(
  //   @Args('createProductUglyInput') createProductUglyInput: CreateProductUglyInput,
  //   @Args('quantity') quantity: number
  // ) {
  //   return this.productUglyService.create({ createProductUglyInput, quantity });
  // }

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

  // @Mutation(() => ProductUgly)
  // async updateProduct(
  //   @Args('productId') productId: string,
  //   @Args('updateProductUglyInput') updateProductUglyInput: UpdateProductUglyInput,
  // ) {
  //   // 판매 완료가 되었는지 확인해보기
  //   await this.productUglyService.checkSoldout({ productId });

  //   // 수정하기
  //   return await this.productUglyService.update({ productId, updateProductUglyInput });
  // }

  // 수량이 0개 되었을 때
  @Mutation(() => Boolean)
  deleteProductUgly(
    @Args('productId') productId: string, //
  ) {
    return this.productUglyService.delete({ productId });
  }
}
