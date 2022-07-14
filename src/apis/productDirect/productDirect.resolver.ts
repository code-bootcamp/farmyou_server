import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { ProductDirect } from './entities/productDirect.entity';
import { ProductDirectService } from './productDirect.service';

@Resolver()
export class ProductDirectResolver {
    constructor(private readonly productDirectService: ProductDirectService) {}

    @Query(() => [ProductDirect])
    fetchDirectProducts() {
        return this.productDirectService.findAll();
    }

    // ElasticSearch??
    // contains/partial
    // @Query(() => ProductDirect)
    // fetchDirectProduct(
    //   @Args('title') title: string, //
    // ) {
    //   return this.productDirectService.findOne({ title });
    // }

    @Query(() => [ProductDirect])
    fetchDirectProductsByDirectStore(
        @Args('directStoreID') directStoreId: string,
    ) {
        return this.productDirectService.find({ directStoreId });
    }

    @Mutation(() => ProductDirect)
    createProductDirect(
        @Args('title') title: string,
        @Args('content') content: string,
        @Args('price') price: number,
        @Args('quantity') quantity: number,
        @Args('category') category: string,
        @Args('directStoreId') directStoreId: string,
        @Args('adminId') adminId: string,
        // @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.productDirectService.create({
            title,
            content,
            price,
            quantity,
            category,
            directStoreId,
            adminId,
        });
    }

    @Mutation(() => Boolean)
    deleteProductDirect(
        @Args('productId') productId: string, //
    ) {
        return this.productDirectService.delete({ productId });
    }
}
