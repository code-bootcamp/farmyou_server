import {
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Seller } from './entities/seller.entity';
import * as bcrypt from 'bcrypt';
import { FileResolver } from '../file/file.resolver';
import { File, IMAGE_TYPE_ENUM } from '../file/entities/file.entity';
import { FileService } from '../file/file.service';

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly fileResolver: FileResolver,

        private readonly fileService: FileService
    ) {}

    async findOne({ email }) {
        return await this.sellerRepository.findOne({
            relations: ['users'],
            where: { email: email },
        });
    }

    async findAll() {
        return await this.sellerRepository.find({
            relations: ['users'],
        });
    }

    async create({ email, hashedPassword: password, name, phone }) {
        const seller = await this.sellerRepository.findOne({
            relations: ['users'],
            where: { email },
        });
        if (seller) throw new ConflictException('이미 등록된 이메일 입니다.');

        const thisSeller = await this.sellerRepository.save({
            email,
            password,
            name,
            phone,
            like: 0,
            users: [],
        });

        // if (files) {
        //     const imageId = await this.fileResolver.uploadFile(files);
        //     const theImage = await this.fileRepository.findOne({
        //         relations: ['productUgly', 'productDirect', 'customer', 'seller', 'admin'],
        //         where: {id: imageId}
        //     });
        //     theImage.type = IMAGE_TYPE_ENUM.SELLER;
        //     theImage.seller = thisSeller;

        //     await this.fileRepository.save(theImage);
        // }

        // return await this.sellerRepository.save({ email, password, name, phone });
        return thisSeller;
    }

    async update({ name, password, phone, imageUrl, currentUser }) {
        const loggedSeller = await this.sellerRepository.findOne({
            relations: ['users'],
            where: {id: currentUser.id},
        });

        if (name) {
            loggedSeller.name = name;
        }

        if (password) {
            loggedSeller.password = await bcrypt.hash(password, 10.2);
        }

        if (phone) {
            loggedSeller.phone = phone;
        }

        await this.fileRepository.save({
            url: imageUrl,
            seller: loggedSeller,
            type: IMAGE_TYPE_ENUM.SELLER,
        });

        // 파일 업로드
        // const imageUrl = await this.fileService.upload({files});

        // const theImage = await this.fileRepository.findOne({
        //     relations: ['productUgly', 'productDirect', 'customer', 'seller', 'admin'],
        //     where: {url: imageUrl}
        // })

        // await this.fileRepository.save(theImage);

        return await this.sellerRepository.save(loggedSeller);
    }

    async postBoardDirect({ sellerId, boardDirectNum }) {
        return this.sellerRepository.save({
            id: sellerId,
            boardDirectNum,
        });
    }
}
