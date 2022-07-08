import {
    HttpException,
    HttpStatus,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDirect } from './entities/productDirect.entity';

@Injectable()
export class ProductDirectService {
    constructor(
        @InjectRepository(ProductDirect)
        private readonly productDirectRepository: Repository<ProductDirect>,
    ) {}

    async findAll() {
        return await this.productDirectRepository.find();
    }

    async findOne({ productId }) {
        return await this.productDirectRepository.findOne({
            where: { id: productId },
        });
    }

    async create({ createProductDirectInput, quantity }) {
        // const original = await this.productDirectRepository.findOne({
        //     where: {name: createProductDirectInput.name}
        // });

        // const origQuantity = original.quantity;

        const result = await this.productDirectRepository.save({
            ...createProductDirectInput,
            category: {id: createProductDirectInput.categoryId},
            directStore: {id: createProductDirectInput.directStoreId}

            // quantity: this.productDirectRepository.quantity + quantity
            // quantity: origQuantity + quantity

            // 하나하나 직접 나열하는 방식
            // name: createProductDirectInput.name,
            // description: createProductDirectInput.description,
            // price: createProductDirectInput.price,
        });
        return result;
    }

    async update({ productId, updateProductDirectInput }) {
        const myproduct = await this.productDirectRepository.findOne({
            where: { id: productId },
        });

        const newProductDirect = {
            ...myproduct,
            id: productId,
            ...updateProductDirectInput,
        };

        return await this.productDirectRepository.save(newProductDirect);
    }

    async checkSoldout({ productId }) {
        const product = await this.productDirectRepository.findOne({
            where: { id: productId },
        });

        if (product.isSoldout) {
            throw new UnprocessableEntityException(
                '이미 판매 완료된 상품입니다.',
            );
        }
        // if (product.isSoldout) {
        //   throw new HttpException(
        //     '이미 판매 완료된 상품입니다.',
        //     HttpStatus.UNPROCESSABLE_ENTITY,
        //   );
        // }
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
        const result = await this.productDirectRepository.softDelete({
            id: productId,
        });
        return result.affected ? true : false;
    }
}
