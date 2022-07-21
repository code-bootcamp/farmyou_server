import {
    Injectable,
    ConflictException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';
import { IamportService } from '../iamport/iamport.service';
import { PRODUCT_TYPE_ENUM } from './payment.resolver';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';

@Injectable()
export class PaymentService {
    //7월 16일 결제 다시 만들기
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ProductUgly)
        private readonly productUglyRepository: Repository<ProductUgly>,

        @InjectRepository(ProductDirect)
        private readonly productDirectRepository: Repository<ProductDirect>,

        private readonly connection: Connection,
    ) {}

    // 중복체크
    async checkDuplicate({ impUid }) {
        const result = await this.paymentRepository.findOne({ impUid });
        if (result) {
            throw new ConflictException('이미 결제된 아이디 입니다.');
        }
    }

    async create({
        impUid,
        amount,
        currentUser,
        productType,
        productId,
        paymentComplete = PAYMENT_STATUS_ENUM.PAYMENT,
    }) {
        const thisUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { id: currentUser.id },
        });

        let theProduct;
        let payment;

        if (productType === PRODUCT_TYPE_ENUM.UGLY_PRODUCT) {
            theProduct = await this.productUglyRepository.findOne({
                relations: ['users', 'seller', 'files'],
                where: {id: productId}
            });
            // 1. 거래기록 1줄 생성 해야함
            payment = this.paymentRepository.create({
                impUid: impUid,
                amount: amount,
                user: thisUser,
                productUgly: theProduct,
                paymentComplete,
            });
        } else if (productType === PRODUCT_TYPE_ENUM.DIRECT_PRODUCT) {
            theProduct = await this.productDirectRepository.findOne({
                relations: ['category', 'directStore', 'users', 'admin', 'files'],
                where: {id: productId}
            });
            // 1. 거래기록 1줄 생성 해야함
            payment = this.paymentRepository.create({
                impUid: impUid,
                amount: amount,
                user: thisUser,
                productDirect: theProduct,
                paymentComplete,
            });
        } else {
            throw new UnprocessableEntityException('올바른 productType을 입력해주세요.');
        }
        console.log(payment);
        await this.paymentRepository.save(payment);

        // 2. 유저의 돈 찾아오기
        // const user = await this.userRepository.findOne({ id: currentUser.id });

        //========================================================
        // 3. 유저의 돈(포인트) 업데이트
        // 하지만 우리 프로젝트 내에선 유저가 돈이나 포인트를 모아두는 것이 없음
        // 그러므로 유저의 돈은 업데이트 할 필요가 없음
        // await this.userRepository.update(
        //   {id: user.id},
        //   {}
        // )
        // //========================================================

        // 4. 프론트엔드에 최종결과 돌려주기
        return payment;
    }

    // 취소된 건인지 확인
    async checkCanceled({ impUid }) {
        const payment = await this.paymentRepository.findOne({
            impUid,
            paymentComplete: PAYMENT_STATUS_ENUM.CANCEL,
        });
        // 이미 취소된 건이면 오류 던지기
        if (payment) {
            throw new ConflictException('이미 취소된 건 입니다.');
        }
    }

    // 다른사람의 결제건을 환불 받지 못하게 하기 위해 자신이 결제한 건인지 체크
    async checkUserPayment({ impUid, currentUser }) {
        const checkUser = await this.paymentRepository.findOne({
            impUid,
            user: { id: currentUser.id },
            paymentComplete: PAYMENT_STATUS_ENUM.PAYMENT,
        });
        // 접속한 유저id 와 impUid 가 같지 않은 유저에게는 오류 던지기
        if (!checkUser) {
            throw new UnprocessableEntityException('결제기록이 없습니다.');
        }
    }

    // 페이먼트 테이블에서 결제 취소 데이터 등록하기
    // cancel 이란 데이터를 추가로 만드는것이고 payment의 상태를 바꾸는 것이 아님
    // 위의 create를 재활용 합니다.
    async cancel({ impUid, amount, currentUser }) {
        const payment = await this.create({
            impUid,
            amount: -amount,
            currentUser,
            productType: null,
            productId: null,
            paymentComplete: PAYMENT_STATUS_ENUM.CANCEL,
        });
        return payment;
    }

    // async findUglyByUser({currentUser}) {
    //     const theUser = await this.userRepository.findOne({
    //         relations: ['sellers', 'directProducts', 'uglyProducts'],
    //         where: {id: currentUser.id}
    //     });

    //     return await this.paymentRepository.find({
    //         relations: ['user', 'productDirect', 'productUgly'],
    //         where: {user: theUser, productDirect: null}
    //     });
    // }

    // async findDirectByUser({currentUser}) {
    //     const theUser = await this.userRepository.findOne({
    //         relations: ['sellers', 'directProducts', 'uglyProducts'],
    //         where: {id: currentUser.id}
    //     });

    //     return await this.paymentRepository.find({
    //         relations: ['user', 'productUgly', 'productUgly'],
    //         where: {user: theUser, productUgly: null}
    //     });
    // }

    async invoice({paymentId, invoiceNum}) {
        const thePayment = await this.paymentRepository.findOne({
            relations: ['user', 'productDirect', 'productUgly'],
            where: {id: paymentId}
        });

        thePayment.invoice = invoiceNum;

        return await this.paymentRepository.save(thePayment);
    }

    async findCompletePayments(currentUser) {
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: {id: currentUser.id}
        });
        return await this.paymentRepository.find({
            relations: ['user', 'productDirect', 'productUgly'],
            where: {user: theUser, paymentComplete: PAYMENT_STATUS_ENUM.PAYMENT}
        });
    }

    async findCanceledPayments(currentUser) {
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: {id: currentUser.id}
        });
        return await this.paymentRepository.find({
            relations: ['user', 'productDirect', 'productUgly'],
            where: {user: theUser, paymentComplete: PAYMENT_STATUS_ENUM.CANCEL}
        });
    }
}
