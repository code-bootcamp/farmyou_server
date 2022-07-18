import { ConflictException, HttpException, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { response } from 'express';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly iamportService: IamportService,
  ) {}
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args("impUid") impUid: string,
    @Args("amount") amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) { 
    // 검증로직
    // 1. iamport 에 요청해서 결제 완료 기록이 존재하는지 확인필요
    // const token = await this.iamportService.getToken()
    // await this.iamportService.checkPaid({impUid, token, amount});
    
    // 2. payment 테이블에는 impUid가 1번만 존재해야 함. (중복 결제 체크)
    await this.paymentService.checkDuplicate({impUid});

    return this.paymentService.create({impUid, amount, currentUser,});
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(()=>Payment)
  async cancelPayment(
    @Args('impUid') impUid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    // 취소하기전 검증로직
    // 1. 이미 취소된 건인지 확인
    await this.paymentService.checkCanceled({impUid})

    // 2. 본인의 결제건이 맞는지 체크
    await this.paymentService.checkUserPayment({
      impUid,
      currentUser,
    })

    // 3. 실제로 import 에 취소 요청하기
    // iamport.service에서 cancel 실행
    const token = await this.iamportService.getToken()
    const canceledAmount = await this.iamportService.cancel({impUid, token})

    // 4. payment 테이블에 결제 취소등록하기
    // payment.service에서 cancel 실행
    return await this.paymentService.cancel({impUid, amount: canceledAmount, currentUser})
  }
  // @Query(() => [Payment])
  // async fetchPayments() {
  //   return await this.paymentService.findAll();
  // }
}
