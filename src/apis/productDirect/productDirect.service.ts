import {
    HttpException,
    HttpStatus,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admin/entities/admin.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';
import { ProductDirect } from './entities/productDirect.entity';

@Injectable()
export class ProductDirectService {
    constructor(
        @InjectRepository(ProductDirect)
        private readonly productDirectRepository: Repository<ProductDirect>,

        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,

        @InjectRepository(DirectStore)
        private readonly directStoreRepository: Repository<DirectStore>,
    ) {}

    async findAll() {
        return await this.productDirectRepository.find();
    }

    // ElasticSearch??
    // contains/partial
    async findOne({ title }) {
        return await this.productDirectRepository.findOne({
            where: { title },
        });
    }

    // async create({ createProductDirectInput, quantity }) {
    //     // const original = await this.productDirectRepository.findOne({
    //     //     where: {name: createProductDirectInput.name}
    //     // });

    //     // const origQuantity = original.quantity;

    //     const result = await this.productDirectRepository.save({
    //         ...createProductDirectInput,
    //         // category: {name: createProductDirectInput.categoryName},
    //         // directStore: {id: createProductDirectInput.directStoreId}

    //         // quantity: this.productDirectRepository.quantity + quantity
    //         // quantity: origQuantity + quantity

    //         // 하나하나 직접 나열하는 방식
    //         // name: createProductDirectInput.name,
    //         // description: createProductDirectInput.description,
    //         // price: createProductDirectInput.price,
    //     });

    //     return result;
    // }

    async create({ title, content, price, quantity, category, directStoreId, currentUser }) {
        const adminId = currentUser.id;

        // const theAdmin = await this.adminRepository.findOne({id: adminId});

        const theStore = await this.directStoreRepository.findOne({id: directStoreId});

        const storeAdmin = theStore.admin.id;

        if (adminId === storeAdmin) {
            const result = await this.productDirectRepository.save({
                title,
                content,
                price,
                quantity,
                category: {id: category},
                directStoreId: {id: directStoreId}
    
                // 하나하나 직접 나열하는 방식
                // name: createProductUglyInput.name,
                // description: createProductUglyInput.description,
                // price: createProductUglyInput.price,
            });
            return result;
        } else {
            throw new UnprocessableEntityException("로그인 된 계정은 권한이 없습니다.");
        }
    }

    // async update({ productId, updateProductDirectInput }) {
    //     const myproduct = await this.productDirectRepository.findOne({
    //         where: { id: productId },
    //     });

    //     const newProductDirect = {
    //         ...myproduct,
    //         id: productId,
    //         ...updateProductDirectInput,
    //     };

    //     return await this.productDirectRepository.save(newProductDirect);
    // }

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
