import {
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    async find({directStoreId}) {
        return await this.productDirectRepository.find({where: {directStoreId}});
    }

    // TODO
    async create({ title, content, price, quantity, categoryId, directStoreId, adminId }) {
        // const adminId = currentUser.id;

        const theAdmin = await this.adminRepository.findOne({where: {id: adminId}});

        const theStore = await this.directStoreRepository.findOne({where: {id: directStoreId}, relations: ['admin']});
        console.log(theStore);
        console.log(theStore.admin);

        const storeAdmin = theStore.admin.id;

        console.log("got here 1");

        if (theAdmin && adminId === storeAdmin) {
            console.log("got here 2");

            const result = await this.productDirectRepository.save({
                title,
                content,
                price,
                quantity,
                categoryId,
                directStoreId,
                adminId
    
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
