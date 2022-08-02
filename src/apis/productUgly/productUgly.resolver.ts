import { UseGuards } from '@nestjs/common';
import {
    Args,
    Mutation,
    Query,
    registerEnumType,
    Resolver,
} from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { CreateProductUglyInput } from './dto/createProductUgly.input';
import { ProductUgly } from './entities/productUgly.entity';
import { ProductUglyService } from './productUgly.service';

export enum SORT_CONDITION_ENUM {
    MOST_RECENT = '최신순',
    PRICE_ASC = '낮은가격순',
    PRICE_DESC = '높은가격순',
}

registerEnumType(SORT_CONDITION_ENUM, {
    name: 'SORT_CONDITION_ENUM',
});

@Resolver()
export class ProductUglyResolver {
    constructor(private readonly productUglyService: ProductUglyService) {}

    @Query(() => [ProductUgly])
    fetchUglyProducts(@Args('productId') productId: string) {
        return this.productUglyService.findAll({ productId });
    }

    @Query(() => ProductUgly)
    fetchProductUgly(
        @Args('productId') productId: string, //
    ) {
        return this.productUglyService.findOne({ productId });
    }

    // 7월 14일 승원 타이틀 조회 테스트
    // 상품이름으로 조회
    @Query(() => [ProductUgly])
    fetchUglyProductByTitle(
        @Args('title') title: string,
    ): Promise<ProductUgly[]> {
        return this.productUglyService.findByTitle(title);
    }

    @Mutation(() => ProductUgly)
    createProductUgly(
        @Args('title') title: string,
        @Args('content') content: string,
        @Args('price') price: number,
        @Args('quantity') quantity: number,
        @Args('origin') origin: string,
        @Args('sellerId') sellerId: string,
        @Args({ name: 'createFileInput', nullable: true })
        createFileInput: CreateProductUglyInput,
    ) {
        return this.productUglyService.create({
            title,
            content,
            price,
            quantity,
            origin,
            sellerId,
            createFileInput,
        });
    }

    // 수량이 0개 되었을 때
    @Mutation(() => Boolean)
    deleteProductUgly(
        @Args('productId') productId: string, //
    ) {
        return this.productUglyService.delete({ productId });
    }

    @Query(() => [ProductUgly])
    fetchUglyProductsSorted(
        @Args({
            name: 'sortBy',
            nullable: true,
            defaultValue: SORT_CONDITION_ENUM.MOST_RECENT,
        })
        sortBy: SORT_CONDITION_ENUM,
        @Args({ name: 'page', nullable: true }) page: number,
    ) {
        return this.productUglyService.findSorted({ sortBy }, page);
    }

    @Query(() => [ProductUgly])
    fetchUglyProductsSortedByTitle(
        @Args({ name: 'title', nullable: true }) title: string,
        @Args({
            name: 'sortBy',
            nullable: true,
            defaultValue: SORT_CONDITION_ENUM.MOST_RECENT,
        })
        sortBy: SORT_CONDITION_ENUM,
        @Args({ name: 'page', nullable: true }) page: number,
    ) {
        return this.productUglyService.findSortedByTitle(
            { title, sortBy },
            page,
        );
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [ProductUgly],
    { description: '구매자가 구매한 못난이 상품 조회' },)
    fetchUglyProductsByUser(@CurrentUser() currentUser: ICurrentUser) {
        return this.productUglyService.findByUser({ currentUser });
    }

    // 8월 2일 생성순으로 조회 하게 변경
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [ProductUgly],
    { description: '판매자가 판매하는 못난이 상품 조회' },)
    fetchUglyProductsBySeller(@CurrentUser() currentUser: ICurrentUser) {
        return this.productUglyService.findBySeller({ currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => ProductUgly)
    updateProductUgly(
        @Args('productId') productId: string,
        @Args({ name: 'title', nullable: true }) title: string,
        @Args({ name: 'content', nullable: true }) content: string,
        @Args({ name: 'price', nullable: true }) price: number,
        @Args({ name: 'quantity', nullable: true }) quantity: number,
        @Args({ name: 'origin', nullable: true }) origin: string,
        @Args({ name: 'createFileInput', nullable: true })
        createFileInput: CreateProductUglyInput,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.productUglyService.update({
            productId,
            title,
            content,
            price,
            quantity,
            origin,
            createFileInput,
            currentUser,
        });
    }
}
