import { ConflictException, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly iamportService: IamportService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) {}

//   @UseGuards(GqlAuthAccessGuard)
//   @Mutation(() => Payment)
//   async createPayment(
//     @Args("impUid") impUid: string,
//     @Args('amount') amount: number, //
//     @CurrentUser() currentUser: ICurrentUser,
//     @Args({name: 'productDirectId', nullable: true}) productDirectId: string,
//     @Args({name: 'productUglyId', nullable: true}) productUglyId: string,
//   ) {
//     const iampAmount = await this.iamportService.getToken({ impUid });
//     const { amount: paymentAmount } = iampAmount;
//     console.log(iampAmount);
//     if (paymentAmount !== amount) {
//       throw new UnprocessableEntityException('유효하지 않은 에러입니다.');
//     }
//     const oldpayment = await this.paymentRepository.findOne({
//       where: { impUid: impUid },
//     });
//     if (oldpayment !== undefined) {
//       throw new ConflictException('이미 결제가 된 건 입니다.');
//     }
//     return await this.paymentService.create({ impUid, amount, currentUser, productDirectId, productUglyId });
//   }

  @Query(() => [Payment])
  async fetchPayments() {
    return await this.paymentService.findAll();
  }
}
