import {
    ConflictException,
    HttpException,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import {
    Mutation,
    Resolver,
    Query,
    Args,
    registerEnumType,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { response } from 'express';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

export enum PRODUCT_TYPE_ENUM {
    UGLY_PRODUCT = 'UGLY_PRODUCT',
    DIRECT_PRODUCT = 'DIRECT_PRODUCT',
}

registerEnumType(PRODUCT_TYPE_ENUM, {
    name: 'PRODUCT_TYPE_ENUM',
});

const item = {
    type: null,
    productId: null,
    
}

@Resolver()
export class PaymentResolver {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly iamportService: IamportService,

        private readonly userService: UserService,

        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) {}

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Payment)
    async createPayment(
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @Args('productType') productType: string,
        @Args('productId') productId: string,
        @Args('quantity') quantity: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        // 검증로직
        // 1. iamport 에 요청해서 결제 완료 기록이 존재하는지 확인필요
        // const token = await this.iamportService.getToken();
        // await this.iamportService.checkPaid({ impUid, token, amount });

        // 2. payment 테이블에는 impUid가 1번만 존재해야 함. (중복 결제 체크)
        await this.paymentService.checkDuplicate({ impUid });

        await this.userService.buy({
            productType,
            productId,
            quantity,
            currentUser,
        });

        return await this.paymentService.create({
            impUid,
            amount,
            currentUser,
            productType,
            productId,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Payment)
    async cancelPayment(
        @Args('impUid') impUid: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        // const theUser = await this.userService.findOneById({
        //     id: currentUser.id
        // });

        const thePayment = await this.paymentRepository.findOne({
            relations: ['user', 'productDirect', 'productUgly'],
            where: {impUid}
        });

        if (thePayment.user.id !== currentUser.id) {
            throw new UnprocessableEntityException('권한이 없습니다');
        }

        // 취소하기전 검증로직
        // 1. 이미 취소된 건인지 확인
        await this.paymentService.checkCanceled({ impUid });

        // 2. 본인의 결제건이 맞는지 체크
        await this.paymentService.checkUserPayment({
            impUid,
            currentUser,
        });

        // 3. 실제로 iamport 에 취소 요청하기
        // iamport.service에서 cancel 실행
        const token = await this.iamportService.getToken();
        const canceledAmount = await this.iamportService.cancel({
            impUid,
            token,
        });

        // 4. payment 테이블에 결제 취소등록하기
        // payment.service에서 cancel 실행
        return await this.paymentService.cancel({
            impUid,
            amount: canceledAmount,
            currentUser,
        });
    }

    // @UseGuards(GqlAuthAccessGuard)
    // @Query(() => [Payment])
    // async fetchUglyPaymentsByUser(
    //     @CurrentUser() currentUser: ICurrentUser,
    // ) {
    //   return await this.paymentService.findUglyByUser({currentUser});
    // }

    // @UseGuards(GqlAuthAccessGuard)
    // @Query(() => [Payment])
    // async fetchDirectPaymentsByUser(
    //     @CurrentUser() currentUser: ICurrentUser,
    // ) {
    //   return await this.paymentService.findDirectByUser({currentUser});
    // }

    @Mutation(() => Payment)
    updateInvoice(
        @Args('paymentId') paymentId: string,
        @Args('invoiceNum') invoiceNum: string,
    ) {
        return this.paymentService.invoice({ paymentId, invoiceNum });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Payment])
    fetchCompletePayments(
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.paymentService.findCompletePayments(currentUser);
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Payment])
    fetchCanceledPayments(
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.paymentService.findCanceledPayments(currentUser);
    }
}
