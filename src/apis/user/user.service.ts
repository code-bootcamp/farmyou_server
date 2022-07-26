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

        private readonly fileService: FileService,
    ) {}

    async findOne({ email }) {
        return await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { email },
        });
    }

    async findOneById({ id }) {
        return await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { id },
        });
    }

    async findAll() {
        return await this.userRepository.find({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
        });
    }

    async create({
        name,
        email,
        hashedPassword: password,
        phone,
        addressUser,
        // imageUrl,
        createFileInput,
    }) {
        const user = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { email },
        });
        if (user) throw new ConflictException('이미 등록된 이메일 입니다.');

        const thisUser = await this.userRepository.save({
            name,
            email,
            password,
            phone,
            sellers: [],
            directProducts: [],
            uglyProducts: [],
            files: [],
        });

        await this.addressUserService.create(
            addressUser.address,
            addressUser.detailedAddress,
            addressUser.postalCode,
            thisUser.id,
            true, // isMain set to "true" since this is the first address of the user
        );

        if (createFileInput) {
            const theImage = await this.fileRepository.create({
                url: createFileInput.imageUrl,
                user: thisUser,
                type: IMAGE_TYPE_ENUM.USER,
            });

            await this.fileRepository.save(theImage);

            thisUser.files.push(theImage);
        }

        return await this.userRepository.save(thisUser);
    }

    async update({ name, password, phone, createFileInput, currentUser }) {
        const loggedUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { id: currentUser.id },
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

        if (createFileInput) {
            const theImage = await this.fileRepository.create({
                url: createFileInput.imageUrl,
                user: loggedUser,
                type: IMAGE_TYPE_ENUM.USER,
            });

            await this.fileRepository.save(theImage);

            const toDelete = loggedUser.files[0].id;
            await this.fileRepository.findOne({id: toDelete});
            await this.fileRepository.delete(toDelete);
            
            loggedUser.files.push(theImage);
        }

        return await this.userRepository.save(loggedUser);
    }

    async updatePassword({ email, newPassword }) {
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { email },
        });

        theUser.password = await bcrypt.hash(newPassword, 10.2);

        return await this.userRepository.save(theUser);
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

    async buy({ productType, productId, quantity, currentUser }) {
        console.log('우선 여기 도착');
        // console.log("CURRENT USER IS ", currentUser);
        const theUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            // where: { id: currentUser.id },
            where: { id: currentUser.id },
        });

        let theProduct;
        let theQuantity;

        if (productType === PRODUCT_TYPE_ENUM.DIRECT_PRODUCT) {
            theProduct = await this.productDirectRepository.findOne({
                relations: [
                    'category',
                    'directStore',
                    'users',
                    'admin',
                    'files',
                ],
                where: { id: productId },
            });

            theQuantity = theProduct.quantity;

            if (quantity > theQuantity) {
                throw new UnprocessableEntityException(
                    '요청하신 구매수량이 너무 많습니다.',
                );
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
                relations: ['users', 'seller', 'files'],
                where: { id: productId },
            });

            theQuantity = theProduct.quantity;

            if (quantity > theQuantity) {
                throw new UnprocessableEntityException(
                    '요청하신 구매수량이 너무 많습니다.',
                );
            }

            theUser.uglyProducts.push(theProduct);

            theProduct.quantity -= quantity;
            theProduct.quantitySold += quantity;
            theProduct.users.push(theUser);

            await this.productUglyRepository.save(theProduct);
        }

        return theUser;
    }

    async findByEmail({ email }) {
        return await this.userRepository.findOne({
            relations: ['sellers', 'directProducts', 'uglyProducts', 'files'],
            where: { email },
        });
    }
}
