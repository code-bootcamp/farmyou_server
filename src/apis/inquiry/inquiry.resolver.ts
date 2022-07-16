import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class InquiryResolver {
    constructor(private readonly inquiryService: InquiryService) {}

    @Query(() => Inquiry)
    fetchInquiry(@Args('id') id: string) {
        return this.inquiryService.findOne({ id });
    }

    @Query(() => [Inquiry])
    fetchInquiriesByProduct(
        @Args('productId') productId: string
    ) {
        return this.inquiryService.findAll(productId);
    }

    // Inquiry (문의) 생성은 User (구매자)만 가능
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    createInquiry(
        @Args('title') title: string,
        @Args('question') question: string,
        @Args({ name: 'productDirectId', nullable: true })
        productDirectId: string,
        @Args({ name: 'productUglyId', nullable: true }) productUglyId: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.inquiryService.create(
            title,
            question,
            productDirectId,
            productUglyId,
            currentUser,
        );
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    postResponse(
        @Args('inquiryId') inquiryId: string,
        @Args('answerTitle') answerTitle: string,
        @Args('answer') answer: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.inquiryService.answer({
            inquiryId,
            answerTitle,
            answer,
            currentUser,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Inquiry)
    editInquiry(
        @Args('inquiryId') inquiryId: string,
        @Args('title') title: string,
        @Args('question') question: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.inquiryService.edit({
            inquiryId,
            title,
            question,
            currentUser,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    deleteInquiry(
        @Args('inquiryId') inquiryId: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.inquiryService.delete({
            inquiryId,
            currentUser,
        });
    }
}
