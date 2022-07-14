import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
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

    @Mutation(() => String)
    createInquiry(
        @Args('title') title: string,
        @Args('content') content: string,
        @Args('userId') userId: string,
        // TODO: 아래 두 개 nullable 적용?
        @Args({name: 'productDirectId', nullable: true}) productDirectId: string,
        @Args({name: 'productUglyId', nullable: true}) productUglyId: string,
    ) {
        return this.inquiryService.create(
            title,
            content,
            userId,
            productDirectId,
            productUglyId,
        );
    }
}
