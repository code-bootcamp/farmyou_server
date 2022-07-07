import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductUglyInput } from './dto/createProductUgly.input';
import { UpdateProductUglyInput } from './dto/updateProductUgly.input';
import { ProductUgly } from './entities/productUgly.entity';
import { ProductUglyService } from './productUgly.service';

@Resolver()
export class ProductUglyResolver {
  constructor(private readonly productUglyService: ProductUglyService) {}

  @Query(() => [ProductUgly])
  fetchProducts() {
    return this.productUglyService.findAll();
  }

  @Query(() => ProductUgly)
  fetchProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productUglyService.findOne({ productId });
  }

  // worked
  @Mutation(() => ProductUgly)
  createProductUgly(
    @Args('createProductUglyInput') createProductUglyInput: CreateProductUglyInput,
    @Args('quantity') quantity: number
  ) {
    return this.productUglyService.create({ createProductUglyInput, quantity });
  }

  @Mutation(() => ProductUgly)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductUglyInput') updateProductUglyInput: UpdateProductUglyInput,
  ) {
    // 판매 완료가 되었는지 확인해보기
    await this.productUglyService.checkSoldout({ productId });

    // 수정하기
    return await this.productUglyService.update({ productId, updateProductUglyInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(
    @Args('productId') productId: string, //
  ) {
    return this.productUglyService.delete({ productId });
  }
}
