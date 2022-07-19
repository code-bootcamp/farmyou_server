import {
    Args,
    Mutation,
    Query,
    registerEnumType,
    Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UpdateAddressUserInput } from '../addressUser/dto/updateAddressUser.input';
import { CreateAddressUserInput } from '../addressUser/dto/createAddressUser.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

export enum PRODUCT_TYPE_ENUM {
    UGLY_PRODUCT = 'UGLY_PRODUCT',
    DIRECT_PRODUCT = 'DIRECT_PRODUCT',
}

registerEnumType(PRODUCT_TYPE_ENUM, {
    name: 'PRODUCT_TYPE_ENUM',
});

@Resolver()
export class UserResolver {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        private readonly userService: UserService, //
    ) {}

    // 회원 생성하기
    @Mutation(() => User)
    async createUser(
        @Args('name') name: string,
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('phone') phone: string,
        @Args('addressUser') addressUser: CreateAddressUserInput,
        @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true })
        files: FileUpload[],
    ) {
        const hashedPassword = await bcrypt.hash(password, 10.2);
        return this.userService.create({
            name,
            email,
            hashedPassword,
            phone,
            addressUser,
            files,
        });
    }

    // 회원 정보 업데이트 하기
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => User)
    async updateUser(
        @Args({ name: 'name', nullable: true }) name: string,
        @Args({ name: 'password', nullable: true }) password: string,
        @Args({ name: 'phone', nullable: true }) phone: string,
        @Args({ name: 'imageUrl', nullable: true }) imageUrl: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return await this.userService.update({
            name,
            password,
            phone,
            imageUrl,
            currentUser,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => User)
    fetchUser(
        @CurrentUser() currentUser: ICurrentUser, //
    ) {
        const id = currentUser.id;
        console.log(id);
        return this.userService.findOneById({ id });
    }

    // 관리자페이지에서 모든유저 조회할때 사용 하게 될 듯
    @Query(() => [User])
    fetchUsers() {
        return this.userService.findAll();
    }

    // PasswordCheckModal
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async checkIfLoggedUser(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('password') password: string,
    ) {
        const passwordOwner = await this.userRepository.findOne({
            id: currentUser.id,
        });
        const correctPassword = passwordOwner.password;

        return bcrypt.compare(password, correctPassword);
    }

    // 좋아유
    @Mutation(() => String)
    async likeYou(
        @Args('userId') userId: string,
        @Args('sellerId') sellerId: string,
    ) {
        const likedSeller = await this.sellerRepository.findOne({
            where: { id: sellerId },
            relations: ['users'],
        });
        const thisUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['sellers'],
        });

        let addSeller: boolean = true;

        for (let i = 0; i < thisUser.sellers.length; i++) {
            if (thisUser.sellers[i].id == likedSeller.id) {
                addSeller = false;
                break;
            }
        }

        if (addSeller) {
            thisUser.sellers.push(likedSeller);

            await this.userRepository.save(thisUser);
        }

        let addUser: boolean = true;

        for (let i = 0; i < likedSeller.users.length; i++) {
            if (likedSeller.users[i].id == thisUser.id) {
                addUser = false;
                break;
            }
        }

        if (addUser) {
            likedSeller.users.push(thisUser);
            likedSeller.like++;

            if (likedSeller.like >= 10) {
                likedSeller.grade = '인기셀러';
            }

            await this.sellerRepository.save(likedSeller);

            return '좋아유~';
        }

        return '이전에 이미 고백했지 말입니다.';
    }

    // 좋아유 취소
    @Mutation(() => String)
    async likeYouNoMore(
        @Args('userId') userId: string,
        @Args('sellerId') sellerId: string,
    ) {
        const likedSeller = await this.sellerRepository.findOne({
            where: { id: sellerId },
            relations: ['users'],
        });
        const thisUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['sellers'],
        });

        for (let i = 0; i < thisUser.sellers.length; i++) {
            if (thisUser.sellers[i].id == likedSeller.id) {
                const firstArray = thisUser.sellers.slice(0, i);
                const secondArray = thisUser.sellers.slice(i + 1);
                thisUser.sellers = firstArray.concat(secondArray);

                await this.userRepository.save(thisUser);

                break;
            }
        }

        for (let i = 0; i < likedSeller.users.length; i++) {
            if (likedSeller.users[i].id == thisUser.id) {
                const firstArray = likedSeller.users.slice(0, i);
                const secondArray = likedSeller.users.slice(i + 1);
                likedSeller.users = firstArray.concat(secondArray);
                likedSeller.like--;

                if (likedSeller.like < 10) {
                    likedSeller.grade = '일반셀러';
                }

                await this.sellerRepository.save(likedSeller);

                return '마음 식었어유~';
            }
        }

        return '애초에 좋아한 적 없었지 말입니다.';
    }

    // 관리자의 유저 삭제
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    deleteUser(@Args('email') email: string) {
        return this.userService.delete({ email });
    }

    // 로그인한 유저가 자기자신을 삭제
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => User)
    async deleteLoginUser(
        @CurrentUser() currentUser: ICurrentUser, //
    ) {
        const result = this.userService.deleteUser({ currentUser });
        if (result) return '로그인한 계정이 삭제되었습니다.';
    }

    // @Mutation(() => ProductDirect || ProductUgly)
    // @Mutation(() => String)
    // async placeProductInCart(
    //     @Args('productType') productType: PRODUCT_TYPE_ENUM,
    //     @Args('productId') productId: string,
    //     @Args('quantity') quantity: number,
    // ) {
    //     return this.userService.place(productType, productId, quantity);
    // }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => User)
    async buyProduct(
        @Args('productType') productType: PRODUCT_TYPE_ENUM,
        @Args('productId') productId: string,
        @Args('quantity') quantity: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.userService.buy({
            productType,
            productId,
            quantity,
            currentUser,
        });
    }
}
