import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry, INQUIRY_STATUS_ENUM } from './entities/inquiry.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private readonly inquiryRepository: Repository<Inquiry>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
}
