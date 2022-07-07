import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}
  @Mutation(() => Payment)
  async createPayment(
    @Args('amount') amount: number, //
    @Args({name: 'productDirectId', nullable: true}) productDirectId: string,
    @Args({name: 'productUglyId', nullable: true}) productUglyId: string,

  ) {
    return await this.paymentService.create({ amount, productDirectId, productUglyId });
  }

  @Query(() => [Payment])
  async fetchPayments() {
    return await this.paymentService.findAll();
  }
}
