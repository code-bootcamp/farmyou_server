import {
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, IMAGE_TYPE_ENUM } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { ProductUgly } from './entities/productUgly.entity';
import { SORT_CONDITION_ENUM } from './productUgly.resolver';

const ELM_PER_PAGE = 10;

@Injectable()
export class ProductUglyService {
    constructor(
        @InjectRepository(ProductUgly)
        private readonly productUglyRepository: Repository<ProductUgly>,

        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async findAll({ productId }) {
        return await this.productUglyRepository
            .createQueryBuilder('productUgly')
            .orderBy('productUgly.createdAt', 'DESC')
            .where('productUgly.id = :id', {
                id: productId,
            })
            .getMany();
    }

    async findOne({ productId }) {
        return await this.productUglyRepository.findOne({
            where: { id: productId },
            relations: ['seller', 'users', 'files'],
        });
    }

    async create({
        title,
        content,
        price,
        quantity,
        origin,
        sellerId,
        createFileInput,
    }) {
        const theSeller = await this.sellerRepository.findOne({
            relations: ['users', 'files'],
            where: { id: sellerId },
        });

        if (theSeller) {
            const result = await this.productUglyRepository.save({
                title,
                content,
                price,
                quantity,
                origin,
                users: [],
                seller: theSeller,
                files: [],
            });

            if (createFileInput) {
                const theImage = await this.fileRepository.create({
                    url: String(createFileInput.imageUrl),
                    productUgly: result,
                    type: IMAGE_TYPE_ENUM.UGLY_PRODUCT,
                });

                await this.fileRepository.save(theImage);

                result.files.push(theImage);
            }

            return await this.productUglyRepository.save(result);
        } else {
            throw new NotFoundException(
                '로그인 된 계정은 판매자 계정이 아닙니다.',
            );
        }
    }

    async update({
        productId,
        title,
        content,
        price,
        quantity,
        origin,
        createFileInput,
        currentUser,
    }) {
        const theProduct = await this.productUglyRepository.findOne({
            relations: ['users', 'seller', 'files'],
            where: { id: productId },
        });

        if (currentUser.id !== theProduct.seller.id) {
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
        }

        if (origin) {
            theProduct.origin = origin;
        }

        if (createFileInput) {
            const theImage = await this.fileRepository.create({
                url: createFileInput.imageUrl,
                productUgly: theProduct,
                type: IMAGE_TYPE_ENUM.UGLY_PRODUCT,
            });

            await this.fileRepository.save(theImage);

            const toDelete = theProduct.files[0].id;
            await this.fileRepository.findOne({ id: toDelete });
            await this.fileRepository.delete(toDelete);

            theProduct.files.push(theImage);
        }

        return await this.productUglyRepository.save(theProduct);
    }

    async delete({ productId }) {
        const result = await this.productUglyRepository.delete({
            id: productId,
        });
        return result.affected ? true : false;
    }

    // 7월 14일 승원 타이틀 조회 테스트
    // 상품이름으로 조회
    async findByTitle(title: string): Promise<ProductUgly[]> {
        const searchData = await this.productUglyRepository.find({
            relations: ['seller', 'users', 'files'],
        });
        let result = searchData.filter((word) => word.title.includes(title));
        return result;
    }

    async findSorted({ sortBy }, page) {
        let orderBy;
        let orderDirection;

        if (sortBy === SORT_CONDITION_ENUM.MOST_RECENT) {
            orderBy = 'productUgly.createdAt';
            orderDirection = 'DESC';
        } else if (sortBy === SORT_CONDITION_ENUM.PRICE_ASC) {
            orderBy = 'productUgly.price';
            orderDirection = 'ASC';
        } else if (sortBy === SORT_CONDITION_ENUM.PRICE_DESC) {
            orderBy = 'productUgly.price';
            orderDirection = 'DESC';
        }

        const result = await this.productUglyRepository
            .createQueryBuilder('productUgly')
            .orderBy(orderBy, orderDirection)
            .leftJoinAndSelect('productUgly.users', 'users')
            .leftJoinAndSelect('productUgly.seller', 'seller')
            .leftJoinAndSelect('productUgly.files', 'files');

        if (!page) {
            return result.getMany();
        } else {
            return result
                .skip((page - 1) * ELM_PER_PAGE)
                .take(ELM_PER_PAGE)
                .getMany();
        }
    }

    async findSortedByTitle({ title, sortBy }, page) {
        // const result = await this.findSorted({ sortBy }, page);

        if (title) {
            let orderBy;
            let orderDirection;

            if (sortBy === SORT_CONDITION_ENUM.MOST_RECENT) {
                orderBy = 'productUgly.createdAt';
                orderDirection = 'DESC';
            } else if (sortBy === SORT_CONDITION_ENUM.PRICE_ASC) {
                orderBy = 'productUgly.price';
                orderDirection = 'ASC';
            } else if (sortBy === SORT_CONDITION_ENUM.PRICE_DESC) {
                orderBy = 'productUgly.price';
                orderDirection = 'DESC';
            }

            const result = await this.productUglyRepository
                .createQueryBuilder('productUgly')
                .orderBy(orderBy, orderDirection)
                .leftJoinAndSelect('productUgly.users', 'users')
                .leftJoinAndSelect('productUgly.seller', 'seller')
                .leftJoinAndSelect('productUgly.files', 'files')
                .where(`productUgly.title LIKE '%${title}%'`);

            if (!page) {
                return result
                    .getMany();
            } else {
                return result
                    .skip((page - 1) * ELM_PER_PAGE)
                    .take(ELM_PER_PAGE)
                    .getMany();
            }
        } else {
            return await this.findSorted({ sortBy }, page);
        }
    }

    async findByUser({ currentUser }) {
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { id: currentUser.id },
        });

        return theUser.uglyProducts;
    }

    async findBySeller({ currentUser }) {
        return await this.productUglyRepository
            .createQueryBuilder('productUgly')
            .leftJoinAndSelect('productUgly.users', 'users1')
            .leftJoinAndSelect('users1.address', 'address')
            .leftJoinAndSelect('users1.sellers', 'sellers')
            .leftJoinAndSelect('users1.directProducts', 'directProducts')
            .leftJoinAndSelect('users1.uglyProducts', 'uglyProducts')
            .leftJoinAndSelect('users1.files', 'files1')
            .leftJoinAndSelect('productUgly.seller', 'seller1')
            .leftJoinAndSelect('seller1.users', 'users2')
            .leftJoinAndSelect('seller1.productUgly', 'productUgly1')
            .leftJoinAndSelect('seller1.files', 'files2')
            .leftJoinAndSelect('productUgly.files', 'files3')
            .leftJoinAndSelect('files3.productUgly', 'productUgly2')
            .leftJoinAndSelect('files3.productDirect', 'productDirect')
            .leftJoinAndSelect('files3.user', 'user')
            .leftJoinAndSelect('files3.seller', 'seller2')
            .leftJoinAndSelect('files3.admin', 'admin')
            .where('productUgly.seller = :id', {
                id: currentUser.id,
            })
            // 생성순으로 조회 하게 만들기 8월 2일 추가
            .orderBy("productUgly.createdAt", "DESC")
            .getMany();

        // return theProducts.filter((product) => product.quantitySold > 0);
    }
}
