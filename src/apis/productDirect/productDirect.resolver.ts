import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateProductDirectInput } from './dto/createProductDirect.input';
import { UpdateProductDirectInput } from './dto/updateProductDirect.input';
import { ProductDirect } from './entities/productDirect.entity';
import { ProductDirectService } from './productDirect.service';

@Resolver()
export class ProductDirectResolver {
  constructor(private readonly productDirectService: ProductDirectService) {}

  // keeping
  @Query(() => [ProductDirect])
  fetchDirectProducts() {
    return this.productDirectService.findAll();
  }

  // ElasticSearch??
  // contains/partial
  @Query(() => ProductDirect)
  fetchDirectProduct(
    @Args('title') title: string, //
  ) {
    return this.productDirectService.findOne({ title });
  }

  // worked
  // @Mutation(() => ProductDirect)
  // createProductDirect(
  //   @Args('createProductDirectInput') createProductDirectInput: CreateProductDirectInput,
  //   @Args('quantity') quantity: number
  // ) {
  //   return this.productDirectService.create({ createProductDirectInput, quantity });
  // }
  @Mutation(() => ProductDirect)
  createProductDirect(
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('price') price: number,
    @Args('quantity') quantity: number,
    @Args('category') category: string,
    @Args('directStoreId') directStoreId: number,
    // @Args('sellerId') sellerId: string,
    @CurrentUser() currentUser: ICurrentUser
  ) {
    return this.productDirectService.create({ title, content, price, quantity, category, directStoreId, currentUser });
  }


  // @Mutation(() => ProductDirect)
  // async updateProduct(
  //   @Args('productId') productId: string,
  //   @Args('updateProductDirectInput') updateProductDirectInput: UpdateProductDirectInput,
  // ) {
  //   // 판매 완료가 되었는지 확인해보기
  //   await this.productDirectService.checkSoldout({ productId });

  //   // 수정하기
  //   return await this.productDirectService.update({ productId, updateProductDirectInput });
  // }

  @Mutation(() => Boolean)
  deleteProductDirect(
    @Args('productId') productId: string, //
  ) {
    return this.productDirectService.delete({ productId });
  }
}
