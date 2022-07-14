import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry, INQUIRY_STATUS_ENUM } from './entities/inquiry.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private readonly inquiryRepository: Repository<Inquiry>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ProductDirect)
        private readonly productDirectRepository: Repository<ProductDirect>,

        @InjectRepository(ProductUgly)
        private readonly productUglyRepository: Repository<ProductUgly>,

        private readonly authService: AuthService,
    ) {}

    async findAll() {
        return await this.inquiryRepository.find();
    }

    async findOne({ title }) {
        return await this.inquiryRepository.findOne({
            where: { title: title },
        });
    }

    async create(title, question, productDirectId, productUglyId, currentUser) {
        const writer = await this.userRepository.findOne({
            where: { id: currentUser.id },
        });

        if (productDirectId) {
            try {
                const result = await this.inquiryRepository.save({
                title,
                question,
                user: writer,
                productDirect: { id: productDirectId },
                status: INQUIRY_STATUS_ENUM.NOT_ANSWERED,
                });
                await this.userRepository.save(writer);
                return `${result.id}번 문의글이 생성되었습니다.`;
            } catch (err) {
                throw new UnprocessableEntityException('올바른 제품ID를 입력해 주세요.');
            }
        } else if (productUglyId) {
            try {
                const result = await this.inquiryRepository.save({
                    title,
                    question,
                    user: writer,
                    productUgly: { id: productUglyId },
                    status: INQUIRY_STATUS_ENUM.NOT_ANSWERED,
                });
                await this.userRepository.save(writer);
                return `${result.id}번 문의글이 생성되었습니다.`;
            } catch (err) {
                throw new UnprocessableEntityException('올바른 제품ID를 입력해 주세요.');
            }
        } else {
            throw new UnprocessableEntityException('제품ID를 입력해 주세요.');
        }
    }

    async answer({ inquiryId, answerTitle, answer, currentUser }) {
        const thisUserType = await this.authService.findLoggedIn({
            currentUser,
        });

        if (!(thisUserType === 'seller' || thisUserType === 'admin')) {
            return '답변을 달 수 있는 권한이 없습니다.';
        }

        const thisInquiry = await this.inquiryRepository.findOne({
            where: { id: inquiryId },
            relations: ['productDirect', 'productUgly', 'user'],
        });

        if (thisInquiry.status === 'ANSWERED') {
            return '이미 답변이 달린 문의글입니다.';
        }

        let theProduct;

        if (thisInquiry && !thisInquiry.productDirect) {
            theProduct = await this.productUglyRepository.findOne({
                where: { id: thisInquiry.productUgly.id },
                relations: ['userId', 'seller'],
            });
        } else if (thisInquiry && !thisInquiry.productUgly) {
            theProduct = await this.productDirectRepository.findOne({
                where: { id: thisInquiry.productDirect.id },
                relations: ['categoryId', 'directStoreId', 'adminId'],
            });
        }

        if (
            (theProduct &&
                theProduct.seller &&
                currentUser.id === theProduct.seller.id) ||
            (theProduct &&
                theProduct.adminId &&
                currentUser.id === theProduct.adminId.id)
        ) {
            const theInquiry = await this.inquiryRepository.findOne({
                id: inquiryId,
            });

            theInquiry.answerTitle = answerTitle;
            theInquiry.answer = answer;
            theInquiry.status = INQUIRY_STATUS_ENUM.ANSWERED;

            await this.inquiryRepository.save(theInquiry);
            return '해당 문의글에 대한 답변이 성공적으로 달렸습니다.';
        } else {
            return '답변을 달 수 있는 권한이 없습니다.';
        }
    }

    async edit({ inquiryId, title, question, currentUser }) {
        const theInquiry = await this.inquiryRepository.findOne({
            relations: ['user'],
            where: { id: inquiryId },
        });

        if (!theInquiry) {
            return '게시글이 존재하지 않습니다.';
        }

        const originalWriterId = theInquiry.user.id;

        if (originalWriterId !== currentUser.id) {
            // return '문의글을 수정할 수 있는 권한이 없습니다.';
            throw new UnprocessableEntityException('문의글을 수정할 수 있는 권한이 없습니다.');
        } else if (theInquiry.status === 'ANSWERED') {
            // return '답변이 달린 글은 수정하거나 삭제할 수 없습니다.';
            throw new UnprocessableEntityException('답변이 달린 글은 수정하거나 삭제할 수 없습니다.');
        }

        theInquiry.title = title;
        theInquiry.question = question;

        // return JSON.stringify(await this.inquiryRepository.save(theInquiry));
        return await this.inquiryRepository.save(theInquiry);
    }

    async delete({ inquiryId, currentUser }) {
        const theInquiry = await this.inquiryRepository.findOne({
            relations: ['user'],
            where: { id: inquiryId },
        });

        if (!theInquiry) {
            return '게시글이 존재하지 않습니다.';
        }

        const originalWriterId = theInquiry.user.id;

        if (originalWriterId !== currentUser.id) {
            return '문의글을 수정할 수 있는 권한이 없습니다.';
        } else if (theInquiry.status === 'ANSWERED') {
            return '답변이 달린 글은 수정하거나 삭제할 수 없습니다.';
        }

        theInquiry.isDeleted = true;
        await this.inquiryRepository.save(theInquiry);

        await this.inquiryRepository.softDelete({
            id: inquiryId,
        });

        return '문의글이 성공적으로 삭제되었습니다.';
    }
}
