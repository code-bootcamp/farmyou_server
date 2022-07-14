import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UpdateAddressUserInput } from '../addressUser/dto/updateAddressUser.input';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { CreateAddressUserInput } from '../addressUser/dto/createAddressUser.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';

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
    ) {
        const hashedPassword = await bcrypt.hash(password, 10.2);
        // console.log(hashedPassword);
        return this.userService.create({
            name,
            email,
            hashedPassword,
            phone,
            addressUser,
        });
    }

    // 회원 정보 업데이트 하기
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => User)
    async updateUser(
        @CurrentUser() currentUser: ICurrentUser,
        @Args({ name: 'email', nullable: true }) email: string,
        @Args({ name: 'password', nullable: true }) password: string,
        @Args({ name: 'phone', nullable: true }) phone: string,
        @Args({ name: 'newAddress', nullable: true })
        newAddress: UpdateAddressUserInput,
    ) {
        return await this.userService.update({
            currentUser,
            email,
            password,
            phone,
            newAddress,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => String)
    fetchUser(
        @CurrentUser() currentUser: ICurrentUser, //
    ) {
        console.log('fetchUser 실행 완료!!!');
        console.log('유저정보는??!!!', currentUser);
        return 'qqq';
    }

    // 관리자페이지에서 모든유저 조회할때 사용 하게 될 듯
    @Query(() => [User])
    fetchUsers() {
        return this.userService.findAll();
    }

    // PasswordCheckModal
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => Boolean)
    async checkIfLoggedUser(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('passwordFirst') passwordFirst: string,
        @Args('passwordSecond') passwordSecond: string,
    ) {
        if (passwordFirst === passwordSecond) {
            const passwordOwner = await this.userRepository.findOne({
                id: currentUser.id,
            });
            const correctPassword = passwordOwner.password;

            const same = bcrypt.compare(passwordFirst, correctPassword);

            return same;
        } else {
            return false;
        }
    }

    @Mutation(() => String)
    async likeYou(
        // @CurrentUser() currentUser: ICurrentUser,
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

        // 이게 안걸러짐
        if (!likedSeller.users.includes(thisUser)) {
            likedSeller.users.push(thisUser);
            likedSeller.like++;
        }

        await this.sellerRepository.save(likedSeller);

        if (!thisUser.sellers.includes(likedSeller)) {
            thisUser.sellers.push(likedSeller);
        }

        await this.userRepository.save(thisUser);

        return '좋아유~';
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
}
