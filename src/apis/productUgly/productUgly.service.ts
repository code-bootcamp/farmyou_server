import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, IMAGE_TYPE_ENUM } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { Seller } from '../seller/entities/seller.entity';
import { ProductUgly } from './entities/productUgly.entity';

const ELM_PER_PAGE = 10;

@Injectable()
export class ProductUglyService {
    constructor(
        @InjectRepository(ProductUgly)
        private readonly productUglyRepository: Repository<ProductUgly>,

        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly fileResolver: FileResolver
    ) {}

    // 성란느님 덕분
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

    async create({ title, content, price, quantity, origin, sellerId, files}) {
        const theSeller = await this.sellerRepository.findOne({
            relations: ['users'],
            where: { id: sellerId },
        });

        // console.log(theSeller);

        if (theSeller) {
            const result = await this.productUglyRepository.save({
                title,
                content,
                price,
                quantity,
                origin,
                seller: theSeller,

                // 하나하나 직접 나열하는 방식
                // name: createProductUglyInput.name,
                // description: createProductUglyInput.description,
                // price: createProductUglyInput.price,
            });

            if (files) {
                const imageId = await this.fileResolver.uploadFile(files);
                const theImage = await this.fileRepository.findOne({
                    relations: ['productUgly', 'productDirect', 'customer', 'seller', 'admin'],
                    where: {id: imageId}
                });
                theImage.type = IMAGE_TYPE_ENUM.UGLY_PRODUCT;
                theImage.productUgly = result;
    
                await this.fileRepository.save(theImage);
            }

            console.log(result.seller);
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
            where: {id: productId},
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
    async findtitle(title: string): Promise<ProductUgly[]> {
        const serchData = await this.productUglyRepository.find({
            relations: ['seller', 'users'],
        });
        let result = serchData.filter((word) => word.title.includes(title));
        return result;
    }

    async findByDateCreated(page) {
        return await this.productUglyRepository
            .createQueryBuilder('productUgly')
            .orderBy('productUgly.createdAt', 'DESC')
            .skip((page - 1) * ELM_PER_PAGE)
            .take(ELM_PER_PAGE)
            .getMany();
    }

    async findByPriceHighToLow(page) {
        return await this.productUglyRepository
            .createQueryBuilder('productUgly')
            .orderBy('productUgly.price', 'DESC')
            .skip((page - 1) * ELM_PER_PAGE)
            .take(ELM_PER_PAGE)
            .getMany();
    }

    async findByPriceLowToHigh(page) {
        return await this.productUglyRepository
            .createQueryBuilder('productUgly')
            .orderBy('productUgly.price', 'ASC')
            .skip((page - 1) * ELM_PER_PAGE)
            .take(ELM_PER_PAGE)
            .getMany();
    }
}
