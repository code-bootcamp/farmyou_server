import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { AddressUserService } from '../addressUser/addressUser.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';

export enum PRODUCT_TYPE_ENUM {
    UGLY_PRODUCT = 'UGLY_PRODUCT',
    DIRECT_PRODUCT = 'DIRECT_PRODUCT',
}

const productInCart = {
    // "productType": PRODUCT_TYPE_ENUM,
    // "productId": String,
    "product": ProductDirect || ProductUgly,
    "quantity": Number
}

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

        private readonly addressUserService: AddressUserService,

        public myCart = new Array()
    ) {}

    async findOne({ email }) {
        return await this.userRepository.findOne({ email });
    }

    async findAll() {
        return await this.userRepository.find();
    }

    async create({
        name,
        email,
        hashedPassword: password,
        phone,
        addressUser,
    }) {
        const user = await this.userRepository.findOne({ email });
        if (user) throw new ConflictException('이미 등록된 이메일 입니다.');

        const thisUser = await this.userRepository.save({
            name,
            email,
            password,
            phone,
            sellers: [],
        });

        console.log(thisUser.sellers);
        console.log(typeof thisUser.sellers);

        await this.addressUserService.create(
            addressUser.address,
            addressUser.detailedAddress,
            addressUser.postalCode,
            thisUser.id,
            true, // isMain set to "true" since this is the first address of the user
        );

        // return await this.userRepository.save({ email, password, name, phone });
        return thisUser;
    }

    async update({ currentUser, email, password, phone, newAddress }) {
        const loggedUser = await this.userRepository.findOne({
            id: currentUser.id,
        });

        if (email) {
            loggedUser.email = email;
        }

        if (password) {
            loggedUser.password = await bcrypt.hash(password, 10);
        }

        if (phone) {
            loggedUser.phone = phone;
        }

        if (newAddress) {
            const loggedUserAddress = await this.addressUserRepository.findOne({
                user: { id: loggedUser.id },
            });
            console.log(loggedUserAddress);
            if (newAddress.isMain) {
                loggedUserAddress.isMain = newAddress.isMain;
            }
            if (newAddress.address) {
                loggedUserAddress.address = newAddress.address;
            }
            if (newAddress.detailedAddress) {
                loggedUserAddress.detailedAddress = newAddress.detailedAddress;
            }
            if (newAddress.postalCode) {
                loggedUserAddress.postalCode = newAddress.postalCode;
            }
            this.addressUserRepository.save(loggedUserAddress);
        }

        return this.userRepository.save(loggedUser);
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

    async place(productType, productId, quantity) {
        let theProduct;

        if (productType === 'UGLY_PRODUCT') {
            theProduct = await this.productUglyRepository.findOne({
                id: productId
            });
        } else {
            theProduct = await this.productDirectRepository.findOne({
                id: productId
            });
        }

        productInCart.product = theProduct;
        productInCart.quantity = quantity;

        console.log(productInCart);

        return productInCart;
    }
}
