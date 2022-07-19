import {
    BadRequestException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, createConnection, Repository } from 'typeorm';
import { Admin } from '../admin/entities/admin.entity';
import { Category } from '../category/entities/category.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';
import { File, IMAGE_TYPE_ENUM } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { User } from '../user/entities/user.entity';
import { ProductDirect } from './entities/productDirect.entity';
import { SORT_CONDITION_ENUM } from './productDirect.resolver';

const ELM_PER_PAGE = 10;

@Injectable()
export class ProductDirectService {
    constructor(
        @InjectRepository(ProductDirect)
        private readonly productDirectRepository: Repository<ProductDirect>,

        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(DirectStore)
        private readonly directStoreRepository: Repository<DirectStore>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly fileResolver: FileResolver,
    ) {}

    async findAll() {
        // return await this.productDirectRepository.find({
        //     relations: ['category', 'directStore', 'users', 'admin']
        // });
        return await this.productDirectRepository
            .createQueryBuilder('productDirect')
            .orderBy('productDirect.createdAt', 'DESC')
            .getMany();
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
            relations: ['category', 'directStore', 'users', 'admin'],
            where: { directStore: { id: directStoreId } },
        });
    }

    async findSorted({ sortBy, directStoreId, categoryId }, page) {
        let orderBy;
        let orderDirection;

        if (sortBy === SORT_CONDITION_ENUM.MOST_RECENT) {
            orderBy = 'productDirect.createdAt';
            orderDirection = 'DESC';
        } else if (sortBy === SORT_CONDITION_ENUM.PRICE_ASC) {
            orderBy = 'productDirect.price';
            orderDirection = 'ASC';
        } else if (sortBy === SORT_CONDITION_ENUM.PRICE_DESC) {
            orderBy = 'productDirect.price';
            orderDirection = 'DESC';
        } else {
            throw new BadRequestException(
                'sortBy 인자값에 최신순/낮은가격순/높은가격순 중 하나를 입력해주세요.',
            );
        }

        if (!directStoreId) {
            return await this.productDirectRepository
                .createQueryBuilder('productDirect')
                .orderBy(orderBy, orderDirection)
                .leftJoinAndSelect('productDirect.directStore', 'directStore')
                .leftJoinAndSelect('productDirect.category', 'category')
                .leftJoinAndSelect('productDirect.admin', 'admin')
                .leftJoinAndSelect('productDirect.users', 'users')
                .where('productDirect.category = :category', {
                    category: categoryId,
                })
                .skip((page - 1) * ELM_PER_PAGE)
                .take(ELM_PER_PAGE)
                .getMany();
        } else if (!categoryId) {
            return await this.productDirectRepository
                .createQueryBuilder('productDirect')
                .orderBy(orderBy, orderDirection)
                .leftJoinAndSelect('productDirect.directStore', 'directStore')
                .leftJoinAndSelect('productDirect.category', 'category')
                .leftJoinAndSelect('productDirect.admin', 'admin')
                .leftJoinAndSelect('productDirect.users', 'users')
                .where('productDirect.directStore = :directStore', {
                    directStore: directStoreId,
                })
                .skip((page - 1) * ELM_PER_PAGE)
                .take(ELM_PER_PAGE)
                .getMany();
        } else {
            return await this.productDirectRepository
                .createQueryBuilder('productDirect')
                .orderBy(orderBy, orderDirection)
                .leftJoinAndSelect('productDirect.directStore', 'directStore')
                .leftJoinAndSelect('productDirect.category', 'category')
                .leftJoinAndSelect('productDirect.admin', 'admin')
                .leftJoinAndSelect('productDirect.users', 'users')
                .where('productDirect.directStore = :directStore', {
                    directStore: directStoreId,
                })
                .andWhere('productDirect.category = :category', {
                    category: categoryId,
                })
                .skip((page - 1) * ELM_PER_PAGE)
                .take(ELM_PER_PAGE)
                .getMany();
        }
    }

    // TODO: not working now
    // async findByName({directStoreName}) {
    //     const store = await this.directStoreRepository.find({relations: ['admin'], where: {name: directStoreName}});
    //     console.log(store);
    //     return await this.productDirectRepository.find({where: {name: directStoreName}});
    // }

    // 7월 14일 승원 타이틀 조회 테스트
    // 상품이름으로 조회
    async findByTitle(title: string): Promise<ProductDirect[]> {
        const searchData = await this.productDirectRepository.find({
            relations: ['directStore', 'users', 'admin'],
        });
        let result = searchData.filter((word) => word.title.includes(title));
        return result;
    }

    // TODO
    async create({
        title,
        content,
        price,
        quantity,
        categoryId,
        directStoreId,
        // adminId,
        files,
        currentUser,
    }) {
        const theAdmin = await this.adminRepository.findOne({
            relations: ['directStore'],
            where: { id: currentUser.id },
        });

        const theStore = await this.directStoreRepository.findOne({
            relations: ['admin'],
            where: { id: directStoreId },
        });

        const theCategory = await this.categoryRepository.findOne({
            id: categoryId,
        });

        const storeAdmin = theStore.admin.id;

        if (theAdmin && currentUser.id === storeAdmin) {
            const result = await this.productDirectRepository.save({
                title,
                content,
                price,
                quantity,
                category: theCategory,
                directStore: theStore,
                admin: theAdmin,
            });

            if (files) {
                const imageId = await this.fileResolver.uploadFile(files);
                const theImage = await this.fileRepository.findOne({
                    relations: [
                        'productUgly',
                        'productDirect',
                        'customer',
                        'seller',
                        'admin',
                    ],
                    where: { id: imageId },
                });
                theImage.type = IMAGE_TYPE_ENUM.DIRECT_PRODUCT;
                theImage.productDirect = result;

                await this.fileRepository.save(theImage);
            }

            return result;
        } else {
            throw new UnprocessableEntityException(
                '로그인 된 계정은 권한이 없습니다.',
            );
        }
    }

    // 이건 왜 여기있지???
    async checkSoldout({ productId }) {
        const product = await this.productDirectRepository.findOne({
            relations: ['categoryId', 'directStore', 'users', 'admin'],
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

    async findByUser({ currentUser }) {
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            where: { id: currentUser.id },
        });

        // return this.productUglyRepository.find({
        //     relations: ['users', 'seller'],
        //     where: { users: { id: theUser.id } },
        // });
        return theUser.directProducts;
    }
}
