import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, registerEnumType, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { ProductDirect } from './entities/productDirect.entity';
import { ProductDirectService } from './productDirect.service';

export enum SORT_CONDITION_ENUM {
    MOST_RECENT = '최신순',
    PRICE_ASC = '낮은가격순',
    PRICE_DESC = '높은가격순',
}

registerEnumType(SORT_CONDITION_ENUM, {
    name: 'SORT_CONDITION_ENUM',
});

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
    fetchDirectProductsSorted(
        @Args('sortBy') sortBy: SORT_CONDITION_ENUM,
        @Args({name: 'directStoreId', nullable: true}) directStoreId: string,
        @Args({name: 'categoryId', nullable: true}) categoryId: string,
        @Args('page') page: number
    ) {
        return this.productDirectService.findSorted({sortBy, directStoreId, categoryId}, page);
    }

    // 7월 14일 승원 타이틀 조회 테스트
    // 상품이름으로 조회
    @Query(() => [ProductDirect])
    fetchUglyProductByTitle(
        @Args('title') title: string,
    ): Promise<ProductDirect[]> {
        return this.productDirectService.findByTitle(title);
    }

    // TODO: not working now
    // @Query(() => [ProductDirect])
    // fetchDirectProductsByDirectStoreName(
    //     @Args('directStoreName') directStoreName: string,
    // ) {
    //     return this.productDirectService.findByName({ directStoreName });
    // }

    // @Query(() => Boolean)
    // checkSoldout(
    //     @Args('productId') productId: string
    // ) {
    //     return this.productDirectService.checkSoldout({productId});
    // }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => ProductDirect)
    createProductDirect(
        @Args('title') title: string,
        @Args('content') content: string,
        @Args('price') price: number,
        @Args('quantity') quantity: number,
        @Args('categoryId') categoryId: string,
        @Args('directStoreId') directStoreId: string,
        // @Args('adminId') adminId: string,
        @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
        files: FileUpload[],
        @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.productDirectService.create({
            title,
            content,
            price,
            quantity,
            categoryId,
            directStoreId,
            // adminId,
            files,
            currentUser
        });
    }

    @Mutation(() => Boolean)
    deleteProductDirect(
        @Args('productId') productId: string, //
    ) {
        return this.productDirectService.delete({ productId });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [ProductDirect])
    fetchDirectProductsByUser(@CurrentUser() currentUser: ICurrentUser) {
        return this.productDirectService.findByUser({ currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => ProductDirect)
    updateProductDirect(
        @Args('productId') productId: string,
        @Args({ name: 'title', nullable: true }) title: string,
        @Args({ name: 'content', nullable: true }) content: string,
        @Args({ name: 'price', nullable: true }) price: number,
        @Args({ name: 'quantity', nullable: true }) quantity: number,
        @Args({ name: 'category', nullable: true }) category: string,
        @Args({ name: 'isDeleted', nullable: true }) isDeleted: boolean,
        @Args({ name: 'isSoldout', nullable: true }) isSoldout: boolean,
        @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.productDirectService.update({
            productId,
            title,
            content,
            price,
            quantity,
            category,
            isDeleted,
            isSoldout,
            currentUser
        });
    }
}
