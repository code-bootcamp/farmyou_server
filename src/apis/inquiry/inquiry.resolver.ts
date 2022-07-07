import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './entities/inquiry.entity';
// import { CreateInquiryInput } from './dto/createInquiry.input';

@Resolver()
export class InquiryResolver {
  constructor(private readonly inquiryService: InquiryService) {}

  // @Query(() => String)
  // getHello() {
  //   return this.boardService.aaa();
  // }

  @Query(() => [Inquiry])
  fetchBoards() {
    return this.inquiryService.findAll();
  }

  @Mutation(() => String)
  createInquiry(
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('userId') userId: string,
    @Args('productDirectId') productDirectId: string,
    @Args('productUglyId') productUglyId: string,
  ) {
    // console.log(content);

    return this.inquiryService.create(title, content, userId, productDirectId, productUglyId);
  }
}
