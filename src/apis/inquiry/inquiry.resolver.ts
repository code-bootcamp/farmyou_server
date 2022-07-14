import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
// import { CreateInquiryInput } from './dto/createInquiry.input';

@Resolver()
export class InquiryResolver {
    constructor(private readonly inquiryService: InquiryService) {}

    @Query(() => Inquiry)
    fetchInquiry(@Args('title') title: string) {
        return this.inquiryService.findOne({ title });
    }

    @Query(() => [Inquiry])
    fetchInquiries() {
        return this.inquiryService.findAll();
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    createInquiry(
        @Args('title') title: string,
        @Args('question') question: string,
        // @Args('userId') userId: string,
        // TODO: 아래 두 개 nullable 적용?
        @Args({name: 'productDirectId', nullable: true}) productDirectId: string,
        @Args({name: 'productUglyId', nullable: true}) productUglyId: string,
        @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.inquiryService.create(
            title,
            question,
            // userId,
            productDirectId,
            productUglyId,
            currentUser
        );
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    updateInquiry(
        @Args('title') title: string,
        @Args('question') question: string,
        // @Args('userId') userId: string,
        // TODO: 아래 두 개 nullable 적용?
        @Args({name: 'productDirectId', nullable: true}) productDirectId: string,
        @Args({name: 'productUglyId', nullable: true}) productUglyId: string,
        @CurrentUser() currentUser: ICurrentUser
    ) {
        return this.inquiryService.create(
            title,
            question,
            // userId,
            productDirectId,
            productUglyId,
            currentUser
        );
    }
}
