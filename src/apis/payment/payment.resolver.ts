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
    private readonly paymentService: PaymentService
  ) {}
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args("impUid") impUid: string,
    @Args("amount") amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) { 
    console.log("뿌꾸뿌꾸뿌꾸뿌꾸ㅃ꾸ㅃ꾸ㅃ꾸ㅃ꾸");
    return this.paymentService.create({impUid, amount, currentUser})
  }

  // @Query(() => [Payment])
  // async fetchPayments() {
  //   return await this.paymentService.findAll();
  // }
}
