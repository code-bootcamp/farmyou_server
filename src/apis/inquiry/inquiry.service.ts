import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry, INQUIRY_STATUS_ENUM } from './entities/inquiry.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { Seller } from '../seller/entities/seller.entity';
import { Admin } from '../admin/entities/admin.entity';

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

        private readonly authService: AuthService
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
        // console.log(currentUser.id);
        // console.log(userId);

        const writer = await this.userRepository.findOne({
            // relations: [''],
            where: {id: currentUser.id}
        });

        if (productDirectId) {
            const result = await this.inquiryRepository.save({
                title,
                question,
                // user: { id: userId },
                user: writer,
                productDirect: { id: productDirectId },
                status: INQUIRY_STATUS_ENUM.NOT_ANSWERED
            });
            await this.userRepository.save(writer);
            return result.id;
        }

        if (productUglyId) {
            const result = await this.inquiryRepository.save({
                title,
                question,
                // user: { id: userId },
                user: writer,
                productUgly: { id: productUglyId },
                status: INQUIRY_STATUS_ENUM.NOT_ANSWERED
            });
            await this.userRepository.save(writer);
            return result.id;
        }
        
        return "올바른 제품ID를 입력해 주세요.";
    }

    async answer({inquiryId, answerTitle, answer, currentUser}) {
        const thisUserType = await this.authService.findLoggedIn({currentUser});

        if (!(thisUserType === "seller" || thisUserType === "admin")) {
            return "답변을 달 수 있는 권한이 없습니다.";
        }

        console.log("got here");

        const thisInquiry = await this.inquiryRepository.findOne({
            where: {id: inquiryId},
            relations: ['productDirect', 'productUgly', 'user']
        });

        // console.log(thisInquiry.status);
        // console.log(JSON.stringify(thisInquiry.status));

        if (thisInquiry.status === "ANSWERED") {
            return "이미 답변이 달린 문의글입니다.";
        }

        let theProduct;

        if (thisInquiry && !thisInquiry.productDirect) {
            theProduct = await this.productUglyRepository.findOne({
                where: {id: thisInquiry.productUgly.id},
                relations: ['userId', 'seller']
            });
        } else if (thisInquiry && !thisInquiry.productUgly) {
            console.log("직매장 상품입니다ㅏㅏㅏㅏㅏㅏㅏ");
            theProduct = await this.productDirectRepository.findOne({
                where: {id: thisInquiry.productDirect.id},
                relations: ['categoryId', 'directStoreId', 'adminId']
            });
        }

        console.log("HERE IS THE PRODUCT: " + JSON.stringify(theProduct));
        // console.log(JSON.stringify(theProduct));
        console.log(JSON.stringify(theProduct.adminId.id));

        if ((theProduct && theProduct.seller && currentUser.id === theProduct.seller.id) || (theProduct && theProduct.adminId && currentUser.id === theProduct.adminId.id)) {
            const theInquiry = await this.inquiryRepository.findOne({
                id: inquiryId
            });

            theInquiry.answerTitle = answerTitle;
            theInquiry.answer = answer;
            theInquiry.status = INQUIRY_STATUS_ENUM.ANSWERED;

            return JSON.stringify(await this.inquiryRepository.save(theInquiry));
        } else {
            return "답변을 달 수 있는 권한이 없습니다.";
        }
    }
}
