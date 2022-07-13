import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { ProductUgly } from './entities/productUgly.entity';

@Injectable()
export class ProductUglyService {
    constructor(
        @InjectRepository(ProductUgly)
        private readonly productUglyRepository: Repository<ProductUgly>,

        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,
    ) {}

    async findAll() {
        return await this.productUglyRepository.find();
    }

    async findOne({ productId }) {
        return await this.productUglyRepository.findOne({
            where: { id: productId },
        });
    }

    async create({ title, content, price, quantity, origin, currentUser }) {
        const sellerId = currentUser.id;

        const theSeller = this.sellerRepository.findOne({id: sellerId});

        if (theSeller) {
            const result = await this.productUglyRepository.save({
                title,
                content,
                price,
                quantity,
                origin,
                sellerId
    
                // 하나하나 직접 나열하는 방식
                // name: createProductUglyInput.name,
                // description: createProductUglyInput.description,
                // price: createProductUglyInput.price,
            });
            return result;
        } else {
            throw new NotFoundException("로그인 된 계정은 판매자 계정이 아닙니다.");
        }
    }

    async update({ productId, updateProductUglyInput }) {
        const myproduct = await this.productUglyRepository.findOne({
            where: { id: productId },
        });

        const newProductUgly = {
            ...myproduct,
            id: productId,
            ...updateProductUglyInput,
        };

        return await this.productUglyRepository.save(newProductUgly);
    }

    async delete({ productId }) {
        // // 1. 실제 삭제
        // const result = await this.productRepository.delete({ id: productId });
        // return result.affected ? true : false;

        // // 2. 소프트 삭제(직접 구현) - isDeleted
        // await this.productRepository.update({ id: productId }, { isDeleted: true });

        // // 3. 소프트 삭제(직접 구현) - deletedAt
        // this.productRepository.update({ id: productId }, { deletedAt: new Date() });

        // // 4. 소프트 삭제(TypeORM 제공) - softRemove
        // this.productRepository.softRemove({ id: productId }); // id로만 삭제 가능

        // 5. 소프트 삭제(TypeORM 제공) - softDelete
        const result = await this.productUglyRepository.softDelete({
            id: productId,
        });
        return result.affected ? true : false;
    }
}
