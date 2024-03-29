import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Seller } from './entities/seller.entity';
import { SellerService } from './seller.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { ProductUglyService } from '../productUgly/productUgly.service';
import { CreateSellerInput } from './dto/createSeller.input';

@Resolver()
export class SellerResolver {
    constructor(
        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        private readonly sellerService: SellerService, //

        private readonly productUglyService: ProductUglyService,
    ) {}

    // 회원 생성하기
    @Mutation(() => Seller)
    async createSeller(
        @Args('name') name: string,
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('phone') phone: string,
        @Args({name: 'createFileInput', nullable: true}) createFileInput: CreateSellerInput,
    ) {
        const hashedPassword = await bcrypt.hash(password, 10.2);
        return this.sellerService.create({
            name,
            email,
            hashedPassword,
            phone,
            // imageUrl
            createFileInput
        });
    }

    // 회원 정보 업데이트 하기
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Seller)
    async updateSeller(
        @Args({ name: 'name', nullable: true }) name: string,
        @Args({ name: 'password', nullable: true }) password: string,
        @Args({ name: 'phone', nullable: true }) phone: string,
        @Args({name: 'createFileInput', nullable: true}) createFileInput: CreateSellerInput,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return await this.sellerService.update({
            name,
            password,
            phone,
            createFileInput,
            currentUser,
        });
    }

    @Query(() => [Seller])
    fetchSellers() {
        return this.sellerService.findAll();
    }

    @Query(() => Seller)
    fetchSellerByEmail(
        @Args('email') email: string
    ) {
        return this.sellerService.findByEmail({email});
    }

    // PasswordCheckModal
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async checkIfLoggedSeller(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('password') password: string,
    ) {
        const passwordOwner = await this.sellerRepository.findOne({
            relations: ['users', 'files'],
            where: {id: currentUser.id},
        });

        const correctPassword = passwordOwner.password;

        return bcrypt.compare(password, correctPassword);
    }

    @Mutation(() => Seller)
    async updateSellerPassword(
        @Args('email') email: string,
        @Args('newPassword') newPassword: string
    ) {
        return this.sellerService.updatePassword({email, newPassword});
    }
}
