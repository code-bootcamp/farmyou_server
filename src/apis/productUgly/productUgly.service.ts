import {
    BadRequestException,
    Injectable,
    NotFoundException,
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

        private readonly fileResolver: FileResolver,
    ) {}

    async findAll() {
        return await this.productUglyRepository.find({
            relations: ['seller', 'users'],
        });
    }

    async findOne({ productId }) {
        return await this.productUglyRepository.findOne({
            where: { id: productId },
            relations: ['seller', 'users'],
        });
    }

    async create({ title, content, price, quantity, origin, sellerId, files }) {
        const theSeller = await this.sellerRepository.findOne({
            relations: ['users'],
            where: { id: sellerId },
        });

        if (theSeller) {
            const result = await this.productUglyRepository.save({
                title,
                content,
                price,
                quantity,
                origin,
                seller: theSeller,
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
                theImage.type = IMAGE_TYPE_ENUM.UGLY_PRODUCT;
                theImage.productUgly = result;

                await this.fileRepository.save(theImage);
            }

            return result;
        } else {
            throw new NotFoundException(
                '로그인 된 계정은 판매자 계정이 아닙니다.',
            );
        }
    }

    async update({ productId, updateProductUglyInput }) {
        const myproduct = await this.productUglyRepository.findOne({
            relations: ['seller', 'users'],
            where: { id: productId },
        });

        const newProductUgly = {
            ...myproduct,
            where: { id: productId },
            ...updateProductUglyInput,
        };

        return await this.productUglyRepository.save(newProductUgly);
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
            relations: ['seller', 'users'],
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
        } else {
            throw new BadRequestException(
                'sortBy 인자값에 최신순/낮은가격순/높은가격순 중 하나를 입력해주세요.',
            );
        }

        return await this.productUglyRepository
            .createQueryBuilder('productUgly')
            .orderBy(orderBy, orderDirection)
            .leftJoinAndSelect('productUgly.users', 'users')
            .leftJoinAndSelect('productUgly.seller', 'seller')
            .skip((page - 1) * ELM_PER_PAGE)
            .take(ELM_PER_PAGE)
            .getMany();
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
        return theUser.uglyProducts;
    }
}
