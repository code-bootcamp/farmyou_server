import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { ProductDirect } from './entities/productDirect.entity';
import { ProductDirectService } from './productDirect.service';

@Resolver()
export class ProductDirectResolver {
    constructor(private readonly productDirectService: ProductDirectService) {}

    @Query(() => [ProductDirect])
    fetchAllDirectProducts() {
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
    fetchDirectProductsByDirectStoreId(
        @Args('directStoreId') directStoreId: string,
    ) {
        return this.productDirectService.findById({ directStoreId });
    }

    @Query(() => [ProductDirect])
    fetchDirectProductsByStoreAndCategoryByDateCreated(
        @Args({name: 'directStoreId', nullable: true}) directStoreId: string,
        @Args({name: 'categoryId', nullable: true}) categoryId: string,
        @Args('page') page: number
    ) {
        return this.productDirectService.findByStoreAndCategoryByDateCreated({directStoreId, categoryId}, page);
    }

    @Query(() => [ProductDirect])
    fetchDirectProductsByStoreAndCategoryByPriceHighToLow(
        @Args({name: 'directStoreId', nullable: true}) directStoreId: string,
        @Args({name: 'categoryId', nullable: true}) categoryId: string,
        @Args('page') page: number
    ) {
        return this.productDirectService.findByStoreAndCategoryByPriceHighToLow({directStoreId, categoryId}, page);
    }

    @Query(() => [ProductDirect])
    fetchDirectProductsByStoreAndCategoryByPriceLowToHigh(
        @Args({name: 'directStoreId', nullable: true}) directStoreId: string,
        @Args({name: 'categoryId', nullable: true}) categoryId: string,
        @Args('page') page: number
    ) {
        return this.productDirectService.findByStoreAndCategoryByPriceLowToHigh({directStoreId, categoryId}, page);
    }

    // TODO: not working now
    // @Query(() => [ProductDirect])
    // fetchDirectProductsByDirectStoreName(
    //     @Args('directStoreName') directStoreName: string,
    // ) {
    //     return this.productDirectService.findByName({ directStoreName });
    // }

    @Mutation(() => ProductDirect)
    createProductDirect(
        @Args('title') title: string,
        @Args('content') content: string,
        @Args('price') price: number,
        @Args('quantity') quantity: number,
        @Args('categoryId') categoryId: string,
        @Args('directStoreId') directStoreId: string,
        @Args('adminId') adminId: string,
        // @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.productDirectService.create({
            title,
            content,
            price,
            quantity,
            categoryId,
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
