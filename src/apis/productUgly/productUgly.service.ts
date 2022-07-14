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

    // 성란느님 덕분
    async findAll() {
        return await this.productUglyRepository.find({
            relations: ['seller']
        });
    }

    async findOne({ productId }) {
        return await this.productUglyRepository.findOne({
            where: { id: productId },
            relations: ['seller'],
        });
    }

    async create({ title, content, price, quantity, origin, sellerId }) {
        const theSeller = await this.sellerRepository.findOne({id: sellerId});

        // console.log(theSeller);

        if (theSeller) {
            const result = await this.productUglyRepository.save({
                title,
                content,
                price,
                quantity,
                origin,
                seller: theSeller
    
                // 하나하나 직접 나열하는 방식
                // name: createProductUglyInput.name,
                // description: createProductUglyInput.description,
                // price: createProductUglyInput.price,
            });
            console.log(result.seller);
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
        const result = await this.productUglyRepository.delete({ id: productId });
        return result.affected ? true : false;
    }

    // 7월 14일 승원 타이틀 조회 테스트
    // 상품이름으로 조회
    async findtitle(
        title : string,
    ): Promise<ProductUgly[]>{
        const serchData = await this.productUglyRepository.find({
            relations: ['seller',]
        });
        let result = serchData.filter((word) =>word.title.includes(title));
        return result
    }

    // //7월 14일 승원 이미지 만들기 테스트
    // async createImageUgleProduct({ productUgly, currentUser }) {
    //     const { urls, } = productUgly;
    //     return await Promise.all(
    //       urls.map((url: string) => {
    //         return this.productUglyRepository.save({
              
    //           user: currentUser,
    //         });
    //       }),
    //     );
    //   }
}
