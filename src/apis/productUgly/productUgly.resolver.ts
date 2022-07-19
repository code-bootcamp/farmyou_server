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
import { ProductDirectService } from '../productDirect/productDirect.service';
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
    fetchUglyProducts(
        @Args('productId') productId: string
    ) {
        return this.productUglyService.findAll({productId});
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
        @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
        files: FileUpload[],
        // @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.productUglyService.create({
            title,
            content,
            price,
            quantity,
            origin,
            sellerId,
            files,
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
        @Args('sortBy') sortBy: SORT_CONDITION_ENUM,
        @Args('page') page: number,
    ) {
        return this.productUglyService.findSorted({ sortBy }, page);
    }
    //
    //
    //-=-=-=-=-=-=-==-=-=-=-=-=-===-=-=-=-=-=-=-=--=-=-=-=-=-=
    // 7월 15일 승원 못난이상품 생성 이미지까지 담아보기 테스트
    // @Mutation(() => ProductUgly)
    // createProductUgly(
    //   @Args('createProductUglyInput') createProductUglyInput: CreateProductUglyInput,
    //   @Args('sellerId') sellerId: string,
    //   // @CurrentUser() currentUser: ICurrentUser
    // ) {
    //   return this.productUglyService.create({ createProductUglyInput, sellerId });
    // }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [ProductUgly])
    fetchUglyProductsByUser(@CurrentUser() currentUser: ICurrentUser) {
        return this.productUglyService.findByUser({ currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [ProductUgly])
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
        @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.productUglyService.update({
            productId,
            title,
            content,
            price,
            quantity,
            origin,
            currentUser
        });
    }
}
