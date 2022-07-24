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
import { Seller } from '../seller/entities/seller.entity';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class PaymentService {
    //7월 16일 결제 다시 만들기
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,

        @InjectRepository(ProductUgly)
        private readonly productUglyRepository: Repository<ProductUgly>,

        @InjectRepository(ProductDirect)
        private readonly productDirectRepository: Repository<ProductDirect>,

        private readonly connection: Connection,
    ) {}

    async create({
        impUid,
        amount,
        currentUser,
        // userId,
        productType,
        productId,
        quantity,
        paymentComplete = PAYMENT_STATUS_ENUM.PAYMENT,
    }) {
        const thisUser = await this.userRepository.findOne({
            // relations: ['sellers', 'directProducts'],
            where: { id: currentUser.id },
            // where: { id: userId },
        });

        let theProduct: ProductDirect | ProductUgly;
        let payment: Payment;

        if (!productType && !productId){

        }

        if (productType === PRODUCT_TYPE_ENUM.UGLY_PRODUCT) {
            theProduct = await this.productUglyRepository.findOne({
                relations: ['users', 'seller'],
                where: { id: productId },
            });

            // 1. 거래기록 1줄 생성 해야함
            payment = this.paymentRepository.create({
                impUid: impUid,
                amount: amount,
                user: thisUser,
                seller: theProduct.seller,
                productUgly: theProduct,
                paymentComplete,
                quantity,
            });
        } else if (productType === PRODUCT_TYPE_ENUM.DIRECT_PRODUCT) {
            theProduct = await this.productDirectRepository.findOne({
                relations: ['category', 'directStore', 'users', 'admin'],
                where: { id: productId },
            });
            // 1. 거래기록 1줄 생성 해야함
            payment = this.paymentRepository.create({
                impUid: impUid,
                amount: amount,
                user: thisUser,
                admin: theProduct.admin,
                productDirect: theProduct,
                paymentComplete,
                quantity,
            });
        } else {
            throw new UnprocessableEntityException(
                '올바른 productType을 입력해주세요.',
            );
        }

        // 2. 유저의 돈 찾아오기
        // const user = await this.userRepository.findOne({ id: currentUser.id });

        console.log('ALSO GOT HERE');
        // 4. 프론트엔드에 최종결과 돌려주기
        return await this.paymentRepository.save(payment);
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
    async checkUserPayment({ paymentId, currentUser }) {
        const checkUser = await this.paymentRepository.findOne({
            id: paymentId,
            // user: { id: userId },
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
    async cancel({ paymentId, currentUser }) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
        });

        if (!payment) {
            throw new UnprocessableEntityException(
                '결제내용이 존재하지 않습니다',
            );
        }

        // const theAmount = payment.amount;
        // payment.amount -= amount;
        let productType;
        let theProduct;

        if (!payment.productUgly) {
            console.log('in direct product');
            productType = PRODUCT_TYPE_ENUM.DIRECT_PRODUCT;
            theProduct = payment.productDirect;
        } else if (!payment.productDirect) {
            console.log('in ugly product');
            productType = PRODUCT_TYPE_ENUM.UGLY_PRODUCT;
            theProduct = payment.productUgly;
        } else {
            throw new ConflictException('Something is wrong.');
        }

        console.log('the product: ', theProduct);

        const newCanceledPayment = await this.create({
            impUid: payment.impUid,
            amount: -payment.amount,
            currentUser,
            productType,
            productId: theProduct.id,
            quantity: payment.quantity,
            paymentComplete: PAYMENT_STATUS_ENUM.CANCEL,
        });
        // return payment;

        theProduct.quantity += payment.quantity;
        theProduct.quantitySold -= payment.quantity;
        theProduct.isSoldout = false;

        await this.paymentRepository.softRemove(payment);
        // await this.userRepository.update
        return await this.paymentRepository.save(newCanceledPayment);
    }

    async invoice({ paymentId, invoiceNum }) {
        const thePayment = await this.paymentRepository.findOne({
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
            where: { id: paymentId },
        });

        thePayment.invoice = invoiceNum;

        return await this.paymentRepository.save(thePayment);
    }

    async findCompletedPayments(userId) {
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            // where: { id: currentUser.id },
            where: { id: userId },
        });
        return await this.paymentRepository.find({
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
            where: {
                user: theUser,
                paymentComplete: PAYMENT_STATUS_ENUM.PAYMENT,
            },
        });
    }

    async findCanceledPayments(userId) {
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            // where: { id: currentUser.id },
            where: { id: userId },
        });
        return await this.paymentRepository.find({
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
            where: {
                user: theUser,
                paymentComplete: PAYMENT_STATUS_ENUM.CANCEL,
            },
        });
    }

    async findPaymentsForSeller(sellerId) {
        const theSeller = await this.sellerRepository.findOne({
            relations: ['users'],
            where: { id: sellerId },
        });
        return await this.paymentRepository.find({
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
            where: {
                seller: theSeller,
                paymentComplete: PAYMENT_STATUS_ENUM.PAYMENT,
            },
        });
    }

    async findCancellationsForSeller(sellerId) {
        const theSeller = await this.sellerRepository.findOne({
            relations: ['users'],
            where: { id: sellerId },
        });
        return await this.paymentRepository.find({
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
            where: {
                seller: theSeller,
                paymentComplete: PAYMENT_STATUS_ENUM.CANCEL,
            },
        });
    }

    async findPaymentsForAdmin(adminId) {
        const theAdmin = await this.adminRepository.findOne({
            relations: ['directStore'],
            where: { id: adminId },
        });
        return await this.paymentRepository.find({
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
            where: {
                admin: theAdmin,
                paymentComplete: PAYMENT_STATUS_ENUM.PAYMENT,
            },
        });
    }

    async findCancellationsForAdmin(adminId) {
        const theAdmin = await this.adminRepository.findOne({
            relations: ['directStore'],
            where: { id: adminId },
        });
        return await this.paymentRepository.find({
            relations: [
                'user',
                'seller',
                'admin',
                'productDirect',
                'productUgly',
            ],
            where: {
                admin: theAdmin,
                paymentComplete: PAYMENT_STATUS_ENUM.CANCEL,
            },
        });
    }
}
