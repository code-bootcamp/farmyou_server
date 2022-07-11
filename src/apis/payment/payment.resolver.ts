import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args("impUid") impUid: string,
    @Args('amount') amount: number, //
    @CurrentUser() currentUser: ICurrentUser,
    @Args({name: 'productDirectId', nullable: true}) productDirectId: string,
    @Args({name: 'productUglyId', nullable: true}) productUglyId: string,

  ) {
    return await this.paymentService.create({ impUid, amount, currentUser, productDirectId, productUglyId });
  }

  @Query(() => [Payment])
  async fetchPayments() {
    return await this.paymentService.findAll();
  }
}
