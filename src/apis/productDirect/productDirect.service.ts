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

    async findAll({ productId }) {
        return await this.productDirectRepository
            .createQueryBuilder('productDirect')
            .orderBy('productDirect.createdAt', 'DESC')
            .where('productDirect.id = :id', {
                id: productId,
            })
            .getMany();
    }

    async findOne({ productId }) {
        return await this.productDirectRepository.findOne({
            where: { id: productId },
            relations: ['category', 'admin', 'users', 'directStore', 'files'],
        });
    }

    async findById({ directStoreId }) {
        return await this.productDirectRepository.find({
            relations: ['category', 'directStore', 'users', 'admin', 'files'],
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
        }

        const thisQuery = await this.productDirectRepository
        .createQueryBuilder('productDirect')
        .orderBy(orderBy, orderDirection)
        .leftJoinAndSelect('productDirect.directStore', 'directStore')
        .leftJoinAndSelect('productDirect.category', 'category')
        .leftJoinAndSelect('productDirect.files', 'files')
        .leftJoinAndSelect('productDirect.admin', 'admin')
        .leftJoinAndSelect('productDirect.users', 'users');

        if (!page) {
            if (!directStoreId && categoryId) {
                return thisQuery
                    .where('productDirect.category = :category', {
                        category: categoryId,
                    })
                    .getMany();
            } else if (directStoreId && !categoryId) {
                return thisQuery
                    .where('productDirect.directStore = :directStore', {
                        directStore: directStoreId,
                    })
                    .getMany();
            } else if (directStoreId && categoryId) {
                return thisQuery
                    .where('productDirect.directStore = :directStore', {
                        directStore: directStoreId,
                    })
                    .andWhere('productDirect.category = :category', {
                        category: categoryId,
                    })
                    .getMany();
            } else {
                return thisQuery
                    .getMany();
            }
        } else {
            if (!directStoreId && categoryId) {
                return thisQuery
                    .where('productDirect.category = :category', {
                        category: categoryId,
                    })
                    .skip((page - 1) * ELM_PER_PAGE)
                    .take(ELM_PER_PAGE)
                    .getMany();
            } else if (directStoreId && !categoryId) {
                return thisQuery
                    .where('productDirect.directStore = :directStore', {
                        directStore: directStoreId,
                    })
                    .skip((page - 1) * ELM_PER_PAGE)
                    .take(ELM_PER_PAGE)
                    .getMany();
            } else if (directStoreId && categoryId) {
                return thisQuery
                    .where('productDirect.directStore = :directStore', {
                        directStore: directStoreId,
                    })
                    .andWhere('productDirect.category = :category', {
                        category: categoryId,
                    })
                    .skip((page - 1) * ELM_PER_PAGE)
                    .take(ELM_PER_PAGE)
                    .getMany();
            } else {
                return thisQuery
                    .skip((page - 1) * ELM_PER_PAGE)
                    .take(ELM_PER_PAGE)
                    .getMany();
            }
        }
    }

    async findSortedByTitle(
        { title, sortBy, directStoreId, categoryId },
        page,
    ) {
        const result = await this.findSorted(
            { sortBy, directStoreId, categoryId },
            page,
        );

        if (title) {
            return result.filter((word) => word.title.includes(title));
        } else {
            return result;
        }
    }

    async findByTitle(title: string): Promise<ProductDirect[]> {
        const searchData = await this.productDirectRepository.find({
            relations: ['category', 'directStore', 'users', 'admin', 'files'],
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
        // imageUrl,
        createFileInput,
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
                users: [],
                admin: theAdmin,
                files: []
            });

            if (createFileInput) {
                const theImage = await this.fileRepository.create({
                    url: createFileInput.imageUrl,
                    productDirect: result,
                    type: IMAGE_TYPE_ENUM.DIRECT_PRODUCT,
                });

                await this.fileRepository.save(theImage);

                result.files.push(theImage);
            }

            return await this.productDirectRepository.save(result);
        } else {
            throw new UnprocessableEntityException(
                '로그인 된 계정은 권한이 없습니다.',
            );
        }
    }

    async checkSoldout({ productId }) {
        const product = await this.productDirectRepository.findOne({
            relations: ['categoryId', 'directStore', 'users', 'admin', 'files'],
            where: { id: productId },
        });

        if (product.isSoldout || product.quantity <= 0) {
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
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { id: currentUser.id },
        });

        return theUser.directProducts;
    }

    async update({
        productId,
        title,
        content,
        price,
        quantity,
        categoryId,
        isDeleted,
        isSoldout,
        // imageUrl,
        createFileInput,
        currentUser,
    }) {
        const theProduct = await this.productDirectRepository.findOne({
            relations: ['category', 'directStore', 'users', 'admin', 'files'],
            where: { id: productId },
        });

        // console.log(theProduct.admin);

        if (currentUser.id !== theProduct.admin.id) {
            throw new UnprocessableEntityException('권한이 없습니다.');
        }

        if (title) {
            theProduct.title = title;
        }

        if (content) {
            theProduct.content = content;
        }

        if (price) {
            theProduct.price = price;
        }

        if (quantity) {
            theProduct.quantity = quantity;
            if (theProduct.quantity > 0) {
                theProduct.isSoldout = false;
            }
        }

        if (categoryId) {
            theProduct.category.id = categoryId;
        }

        if (isDeleted) {
            theProduct.isDeleted = isDeleted;
        }

        if (isSoldout) {
            theProduct.isSoldout = isSoldout;
        }

        if (createFileInput) {
            const theImage = await this.fileRepository.create({
                url: createFileInput.imageUrl,
                productDirect: theProduct,
                type: IMAGE_TYPE_ENUM.DIRECT_PRODUCT,
            });

            await this.fileRepository.save(theImage);

            const toDelete = theProduct.files[0].id;
            await this.fileRepository.findOne({id: toDelete});
            await this.fileRepository.delete(toDelete);

            theProduct.files.push(theImage);
        }

        return await this.productDirectRepository.save(theProduct);
    }
}
