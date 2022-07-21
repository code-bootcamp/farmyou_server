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
    ) {}

    async findOne({ email }) {
        return await this.sellerRepository.findOne({
            relations: ['users', 'files'],
            where: { email: email },
        });
    }

    async findAll() {
        return await this.sellerRepository.find({
            relations: ['users', 'files'],
        });
    }

    async create({ email, hashedPassword: password, name, phone, createFileInput }) {
        const seller = await this.sellerRepository.findOne({
            relations: ['users', 'files'],
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
            files: []
        });

        if (createFileInput) {
            const theImage = await this.fileRepository.create({
                url: createFileInput.imageUrl,
                seller: thisSeller,
                type: IMAGE_TYPE_ENUM.SELLER,
            });

            await this.fileRepository.save(theImage);

            thisSeller.files.push(theImage);
        }

        // if (files) {
        //     const imageId = await this.fileResolver.uploadFile(files);
        //     const theImage = await this.fileRepository.findOne({
        //         relations: ['productUgly', 'productDirect', 'user', 'seller', 'admin'],
        //         where: {id: imageId}
        //     });
        //     theImage.type = IMAGE_TYPE_ENUM.SELLER;
        //     theImage.seller = thisSeller;

        //     await this.fileRepository.save(theImage);
        // }

        // return await this.sellerRepository.save({ email, password, name, phone });
        return await this.sellerRepository.save(thisSeller);
    }

    async update({ name, password, phone, createFileInput, currentUser }) {
        const loggedSeller = await this.sellerRepository.findOne({
            relations: ['users', 'files'],
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

        if (createFileInput) {
            const theImage = await this.fileRepository.create({
                url: createFileInput.imageUrl,
                seller: loggedSeller,
                type: IMAGE_TYPE_ENUM.SELLER,
            });

            await this.fileRepository.save(theImage);

            loggedSeller.files.push(theImage);
        }

        // 파일 업로드
        // const imageUrl = await this.fileService.upload({files});

        // const theImage = await this.fileRepository.findOne({
        //     relations: ['productUgly', 'productDirect', 'user', 'seller', 'admin'],
        //     where: {url: imageUrl}
        // })

        // await this.fileRepository.save(theImage);

        return await this.sellerRepository.save(loggedSeller);
    }

    async postBoardDirect({ sellerId, boardDirectNum }) {
        return await this.sellerRepository.save({
            id: sellerId,
            boardDirectNum,
        });
    }

    async findByEmail({email}) {
        return await this.sellerRepository.findOne({
            relations: ['users', 'files'],
            where: {email}
        })
    }

    async updatePassword({email, newPassword}) {
        const theSeller = await this.sellerRepository.findOne({
            relations: ['users', 'files'],
            where: {email}
        });

        theSeller.password = await bcrypt.hash(newPassword, 10.2);

        return await this.sellerRepository.save(theSeller);
    }
}
