import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, createConnection, Repository } from 'typeorm';
import { Admin } from '../admin/entities/admin.entity';
import { Category } from '../category/entities/category.entity';
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
    // async findOne({ title }) {
    //     return await this.productDirectRepository.findOne({
    //         where: { title },
    //     });
    // }

    async findById({ directStoreId }) {
        return await this.productDirectRepository.find({
            where: { directStoreId },
        });
    }

    async findByStoreAndCategory({ directStoreId, categoryId }, page) {
        if (!directStoreId) {
            return await this.productDirectRepository
                .createQueryBuilder('productDirect')
                .orderBy('productDirect.createdAt', 'DESC')
                .leftJoinAndSelect('productDirect.directStoreId', 'directStore')
                .leftJoinAndSelect('productDirect.categoryId', 'categoryId')
                .where('productDirect.categoryId = :categoryId', {
                    categoryId: categoryId,
                })
                .skip((page-1)*10)
                .take(10)
                .getMany();
        } else if (!categoryId) {
            return await this.productDirectRepository
                .createQueryBuilder('productDirect')
                .orderBy('productDirect.createdAt', 'DESC')
                .leftJoinAndSelect('productDirect.directStoreId', 'directStore')
                .leftJoinAndSelect('productDirect.categoryId', 'categoryId')
                .where('productDirect.directStoreId = :directStoreId', {
                    directStoreId: directStoreId,
                })
                .skip((page-1)*10)
                .take(10)
                .getMany();
        } else {
            return await this.productDirectRepository
                .createQueryBuilder('productDirect')
                .orderBy('productDirect.createdAt', 'DESC')
                .leftJoinAndSelect('productDirect.directStoreId', 'directStore')
                .leftJoinAndSelect('productDirect.categoryId', 'categoryId')
                .where('productDirect.directStoreId = :directStoreId', {
                    directStoreId: directStoreId,
                })
                .andWhere('productDirect.categoryId = :categoryId', {
                    categoryId: categoryId,
                })
                .skip((page-1)*10)
                .take(10)
                .getMany();
        }
    }

    // TODO: not working now
    // async findByName({directStoreName}) {
    //     const store = await this.directStoreRepository.find({relations: ['admin'], where: {name: directStoreName}});
    //     console.log(store);
    //     return await this.productDirectRepository.find({where: {name: directStoreName}});
    // }

    // TODO
    async create({
        title,
        content,
        price,
        quantity,
        categoryId,
        directStoreId,
        adminId,
    }) {
        // const adminId = currentUser.id;

        const theAdmin = await this.adminRepository.findOne({
            where: { id: adminId },
        });

        const theStore = await this.directStoreRepository.findOne({
            where: { id: directStoreId },
            relations: ['admin'],
        });
        console.log(theStore);
        console.log(theStore.admin);

        const storeAdmin = theStore.admin.id;

        if (theAdmin && adminId === storeAdmin) {
            const result = await this.productDirectRepository.save({
                title,
                content,
                price,
                quantity,
                categoryId,
                directStoreId,
                adminId,

                // 하나하나 직접 나열하는 방식
                // name: createProductUglyInput.name,
                // description: createProductUglyInput.description,
                // price: createProductUglyInput.price,
            });
            return result;
        } else {
            throw new UnprocessableEntityException(
                '로그인 된 계정은 권한이 없습니다.',
            );
        }
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
    }

    async delete({ productId }) {
        const result = await this.productDirectRepository.softDelete({
            id: productId,
        });
        return result.affected ? true : false;
    }
}
