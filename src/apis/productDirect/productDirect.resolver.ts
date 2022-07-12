import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductDirectInput } from './dto/createProductDirect.input';
import { UpdateProductDirectInput } from './dto/updateProductDirect.input';
import { ProductDirect } from './entities/productDirect.entity';
import { ProductDirectService } from './productDirect.service';

@Resolver()
export class ProductDirectResolver {
  constructor(private readonly productDirectService: ProductDirectService) {}

  // keeping
  @Query(() => [ProductDirect])
  fetchProducts() {
    return this.productDirectService.findAll();
  }

  // ElasticSearch??
  // contains/partial
  @Query(() => ProductDirect)
  fetchProduct(
    @Args('title') title: string, //
  ) {
    return this.productDirectService.findOne({ title });
  }

  // worked
  @Mutation(() => ProductDirect)
  createProductDirect(
    @Args('createProductDirectInput') createProductDirectInput: CreateProductDirectInput,
    @Args('quantity') quantity: number
  ) {
    return this.productDirectService.create({ createProductDirectInput, quantity });
  }

  @Mutation(() => ProductDirect)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductDirectInput') updateProductDirectInput: UpdateProductDirectInput,
  ) {
    // 판매 완료가 되었는지 확인해보기
    await this.productDirectService.checkSoldout({ productId });

    // 수정하기
    return await this.productDirectService.update({ productId, updateProductDirectInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productDirectService.delete({ productId });
  }
}
