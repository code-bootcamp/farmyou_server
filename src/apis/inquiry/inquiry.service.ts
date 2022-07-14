import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InquiryService {
    constructor(
        @InjectRepository(Inquiry)
        private readonly inquiryRepository: Repository<Inquiry>,
    ) {}

    async findAll() {
        return await this.inquiryRepository.find();
    }

    async findOne({ title }) {
        return await this.inquiryRepository.findOne({
            where: { title: title },
        });
    }

    async create(title, content, userId, productDirectId, productUglyId) {
        if (productDirectId) {
            const result = await this.inquiryRepository.save({
                title,
                content,
                user: { id: userId },
                productDirect: { id: productDirectId },
            });
            return JSON.stringify(result);
        }

        if (productUglyId) {
            const result = await this.inquiryRepository.save({
                title,
                content,
                user: { id: userId },
                productUglyId: { id: productUglyId },
            });
            return JSON.stringify(result);
        }
        
        return "올바른 제품ID를 입력해 주세요.";
    }
}
