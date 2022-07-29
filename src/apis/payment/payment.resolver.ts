import {
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
import { UserService } from '../user/user.service';

export enum PRODUCT_TYPE_ENUM {
    UGLY_PRODUCT = 'UGLY_PRODUCT',
    DIRECT_PRODUCT = 'DIRECT_PRODUCT',
}

registerEnumType(PRODUCT_TYPE_ENUM, {
    name: 'PRODUCT_TYPE_ENUM',
});

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
    @Mutation(() => Payment,
    { description: '결제 생성 (로그인 필요)' },)
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
            quantity
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Payment,
    { description: '결제 취소 (로그인 필요)' },)
    async cancelPayment(
        @Args('paymentId') paymentId: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        const thePayment = await this.paymentRepository.findOne({
            relations: ['user', 'seller', 'admin', 'productDirect', 'productUgly'],
            where: {id: paymentId}
        });

        if (!thePayment) {
            throw new UnprocessableEntityException('존재하지 않거나 이미 취소된 결제건입니다');
        }

        if (thePayment.user.id !== currentUser.id) {
            throw new UnprocessableEntityException('권한이 없습니다');
        }

        // 취소하기전 검증로직
        // 1. 이미 취소된 건인지 확인
        await this.paymentService.checkCanceled({ paymentId });

        // 2. 본인의 결제건이 맞는지 체크
        await this.paymentService.checkUserPayment({
            paymentId,
            currentUser,
        });

        // 3. 실제로 iamport 에 취소 요청하기
        const impUid = thePayment.impUid;
        const token = await this.iamportService.getToken();
        const requestedAmount = thePayment.amount;


        await this.iamportService.cancel({
            impUid,
            token,
            requestedAmount
        });

        // 4. payment 테이블에 결제 취소등록하기
        return await this.paymentService.cancel({
            paymentId,
            currentUser,
        });
    }

    @Mutation(() => Payment,
    { description: '송장번호 업데이트' },)
    updateInvoice(
        @Args('paymentId') paymentId: string,
        @Args('invoiceNum') invoiceNum: string,
    ) {
        return this.paymentService.invoice({ paymentId, invoiceNum });
    }

    // @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Payment],
    { description: '구매자의 결제 완료 조회' },)
    fetchCompletedPaymentsOfUser(
        // @CurrentUser() currentUser: ICurrentUser,
        @Args('userId') userId: string
    ) {
        return this.paymentService.findCompletedPayments(userId);
    }

    // @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Payment],
    { description: '구매자의 결제 취소 조회' },)
    fetchCanceledPaymentsOfUser(
        // @CurrentUser() currentUser: ICurrentUser,
        @Args('userId') userId: string
    ) {
        // return this.paymentService.findCanceledPayments(currentUser);
        return this.paymentService.findCanceledPayments(userId);
    }

    @Query(() => [Payment])
    fetchCompletedPaymentsForSeller(
        @Args('sellerId') sellerId: string
    ) {
        return this.paymentService.findPaymentsForSeller(sellerId);
    }

    @Query(() => [Payment])
    fetchCanceledPaymentsForSeller(
        @Args('sellerId') sellerId: string
    ) {
        return this.paymentService.findCancellationsForSeller(sellerId);
    }

    @Query(() => [Payment])
    fetchCompletedPaymentsForAdmin(
        @Args('adminId') adminId: string
    ) {
        return this.paymentService.findPaymentsForAdmin(adminId);
    }

    @Query(() => [Payment])
    fetchCanceledPaymentsForAdmin(
        @Args('adminId') adminId: string
    ) {
        return this.paymentService.findCancellationsForAdmin(adminId);
    }
}
