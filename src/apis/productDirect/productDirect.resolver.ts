import { UseGuards } from '@nestjs/common';
import {
    Args,
    Mutation,
    Query,
    registerEnumType,
    Resolver,
} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateProductDirectInput } from './dto/createProductDirect.input';
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
    fetchDirectProducts(@Args('productId') productId: string) {
        return this.productDirectService.findAll({ productId });
    }

    @Query(() => ProductDirect)
    fetchProductDirect(
        @Args('productId') productId: string, //
    ) {
        return this.productDirectService.findOne({ productId });
    }

    @Query(() => [ProductDirect])
    fetchDirectProductsByDirectStoreId(
        @Args('directStoreId') directStoreId: string,
    ) {
        return this.productDirectService.findById({ directStoreId });
    }

    @Query(() => [ProductDirect])
    fetchDirectProductsSorted(
        @Args({
            name: 'sortBy',
            nullable: true,
            defaultValue: SORT_CONDITION_ENUM.MOST_RECENT,
        })
        sortBy: SORT_CONDITION_ENUM,
        @Args({ name: 'directStoreId', nullable: true }) directStoreId: string,
        @Args({ name: 'categoryId', nullable: true }) categoryId: string,
        @Args({ name: 'page', nullable: true }) page: number,
    ) {
        return this.productDirectService.findSorted(
            { sortBy, directStoreId, categoryId },
            page,
        );
    }

    @Query(() => [ProductDirect])
    fetchDirectProductsSortedByTitle(
        @Args({ name: 'title', nullable: true }) title: string,
        @Args({
            name: 'sortBy',
            nullable: true,
            defaultValue: SORT_CONDITION_ENUM.MOST_RECENT,
        })
        sortBy: SORT_CONDITION_ENUM,
        @Args({ name: 'directStoreId', nullable: true }) directStoreId: string,
        @Args({ name: 'categoryId', nullable: true }) categoryId: string,
        @Args({ name: 'page', nullable: true }) page: number,
    ) {
        return this.productDirectService.findSortedByTitle(
            { title, sortBy, directStoreId, categoryId },
            page,
        );
    }

    // 7월 14일 승원 타이틀 조회 테스트
    // 상품이름으로 조회
    @Query(() => [ProductDirect])
    fetchDirectProductByTitle(
        @Args('title') title: string,
    ): Promise<ProductDirect[]> {
        return this.productDirectService.findByTitle(title);
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => ProductDirect)
    createProductDirect(
        @Args('title') title: string,
        @Args('content') content: string,
        @Args('price') price: number,
        @Args('quantity') quantity: number,
        @Args('categoryId') categoryId: string,
        @Args('directStoreId') directStoreId: string,
        // @Args({ name: 'imageUrl', nullable: true }) imageUrl: string,
        @Args({ name: 'createFileInput', nullable: true })
        createFileInput: CreateProductDirectInput,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.productDirectService.create({
            title,
            content,
            price,
            quantity,
            categoryId,
            directStoreId,
            createFileInput,
            currentUser,
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
        @Args({ name: 'categoryId', nullable: true }) categoryId: string,
        @Args({ name: 'isDeleted', nullable: true }) isDeleted: boolean,
        @Args({ name: 'isSoldout', nullable: true }) isSoldout: boolean,
        @Args({ name: 'createFileInput', nullable: true })
        createFileInput: CreateProductDirectInput,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.productDirectService.update({
            productId,
            title,
            content,
            price,
            quantity,
            categoryId,
            isDeleted,
            isSoldout,
            createFileInput,
            currentUser,
        });
    }
}
