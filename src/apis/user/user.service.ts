import {
    ConflictException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { AddressUserService } from '../addressUser/addressUser.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { FileResolver } from '../file/file.resolver';
import { File, IMAGE_TYPE_ENUM } from '../file/entities/file.entity';
import { FileService } from '../file/file.service';

export enum PRODUCT_TYPE_ENUM {
    UGLY_PRODUCT = 'UGLY_PRODUCT',
    DIRECT_PRODUCT = 'DIRECT_PRODUCT',
}

// const productInCart = {
//     // "productType": PRODUCT_TYPE_ENUM,
//     // "productId": String,
//     "product": ProductDirect || ProductUgly,
//     "quantity": Number
// }

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(AddressUser)
        private readonly addressUserRepository: Repository<AddressUser>,

        @InjectRepository(ProductDirect)
        private readonly productDirectRepository: Repository<ProductDirect>,

        @InjectRepository(ProductUgly)
        private readonly productUglyRepository: Repository<ProductUgly>,

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly addressUserService: AddressUserService,

        private readonly fileResolver: FileResolver,

        private readonly fileService: FileService
    ) {}

    async findOne({ email }) {
        return await this.userRepository.findOne({ 
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            where: {email}
        });
    }

    async findOneById({ id }) {
        return await this.userRepository.findOne({ 
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            where: {id}
        });
    }

    async findAll() {
        return await this.userRepository.find({
            relations: ['sellers', 'directProducts', 'uglyProducts']
        });
    }

    async create({
        name,
        email,
        hashedPassword: password,
        phone,
        addressUser,
        files
    }) {
        const user = await this.userRepository.findOne({ 
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            where: {email}
        });
        if (user) throw new ConflictException('이미 등록된 이메일 입니다.');

        const thisUser = await this.userRepository.save({
            name,
            email,
            password,
            phone,
            sellers: [],
        });

        await this.addressUserService.create(
            addressUser.address,
            addressUser.detailedAddress,
            addressUser.postalCode,
            thisUser.id,
            true, // isMain set to "true" since this is the first address of the user
        );

        if (files) {
            const imageId = await this.fileResolver.uploadFile(files);
            const theImage = await this.fileRepository.findOne({
                relations: ['productUgly', 'productDirect', 'customer', 'seller', 'admin'],
                where: {id: imageId}
            });
            theImage.type = IMAGE_TYPE_ENUM.USER;
            theImage.customer = thisUser;

            await this.fileRepository.save(theImage);
        }

        // return await this.userRepository.save({ email, password, name, phone });
        return thisUser;
    }

    async update({ name, password, phone, imageUrl, currentUser }) {
        const loggedUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            where: {id: currentUser.id},
        });

        if (name) {
            loggedUser.name = name;
        }

        if (password) {
            loggedUser.password = await bcrypt.hash(password, 10.2);
        }

        if (phone) {
            loggedUser.phone = phone;
        }

        await this.fileRepository.save({
            url: imageUrl,
            seller: loggedUser,
            type: IMAGE_TYPE_ENUM.USER,
        });

        // 파일 업로드
        // const imageUrl = await this.fileService.upload({files});

        // const theImage = await this.fileRepository.findOne({
        //     relations: ['productUgly', 'productDirect', 'customer', 'seller', 'admin'],
        //     where: {url: imageUrl}
        // })

        // await this.fileRepository.save(theImage);

        return await this.userRepository.save(loggedUser);
    }

    async delete({ email }) {
        const result = await this.userRepository.delete({ email });
        return result.affected ? true : false;
    }

    async deleteUser({ currentUser }) {
        const result = await this.userRepository.softDelete({
            id: currentUser.id,
        });
        return result.affected ? true : false;
    }

    // async place(productType, productId, quantity) {
    //     let theProduct;

    //     if (productType === 'UGLY_PRODUCT') {
    //         theProduct = await this.productUglyRepository.findOne({
    //             relations: ['sellers', 'directProducts', 'uglyProducts'],
    //             where: {id: productId}
    //         });
    //     } else {
    //         theProduct = await this.productDirectRepository.findOne({
    //             relations: ['sellers', 'directProducts', 'uglyProducts'],
    //             where: {id: productId}
    //         });
    //     }

    //     productInCart.product = theProduct;
    //     productInCart.quantity = quantity;

    //     return productInCart;
    // }

    async buy({productType, productId, quantity, currentUser}) {
        // console.log("CURRENT USER IS ", currentUser);
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts'],
            where: {id: currentUser.id}
        })

        let theProduct;
        let theQuantity;

        if (productType === PRODUCT_TYPE_ENUM.DIRECT_PRODUCT) {
            theProduct = await this.productDirectRepository.findOne({
                relations: ['category', 'directStore', 'users', 'admin'],
                where: {id: productId}
            });

            theQuantity = theProduct.quantity;

            if (quantity > theQuantity) {
                throw new UnprocessableEntityException('요청하신 구매수량이 너무 많습니다.');
            }

            theUser.directProducts.push(theProduct);

            theProduct.quantity -= quantity;
            if (theProduct.quantity === 0) {
                theProduct.isSoldout = true;
            }
            
            theProduct.quantitySold += quantity;
            theProduct.users.push(theUser);

            await this.productDirectRepository.save(theProduct);

        } else if (productType === PRODUCT_TYPE_ENUM.UGLY_PRODUCT) {
            theProduct = await this.productUglyRepository.findOne({
                relations: ['users', 'seller'],
                where: {id: productId}
            });

            console.log(theProduct);
            console.log(theProduct.quantity);

            theQuantity = theProduct.quantity;

            if (quantity > theQuantity) {
                throw new UnprocessableEntityException('요청하신 구매수량이 너무 많습니다.');
            }

            theUser.uglyProducts.push(theProduct);

            theProduct.quantity -= quantity;
            theProduct.quantitySold += quantity;
            theProduct.users.push(theUser);

            await this.productUglyRepository.save(theProduct);
        }

        return theUser;
    }
}
