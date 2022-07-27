import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class AdminResolver {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,

        @InjectRepository(Seller)
        private readonly sellerRepository: Repository<Seller>,

        @InjectRepository(DirectStore)
        private readonly directStoreRepository: Repository<DirectStore>,

        private readonly adminService: AdminService, //
    ) {}

    // 관리자 생성하기
    @Mutation(() => Admin,
    { description: '관리자 계성 생성' },)
    async createAdmin(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args({ name: 'directStoreId', nullable: true }) directStoreId: string,
    ) {
        const hashedPassword = await bcrypt.hash(password, 10.2);

        return this.adminService.create({
            email,
            hashedPassword,
            directStoreId,
        });
    }

    // 관리자 정보 수정하기
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Admin,
    { description: '관리자 정보 수정 (로그인필요)' })
    async updateAdmin(
        @Args({name: 'password', nullable: true}) password: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.adminService.update({
            password,
            currentUser
        });
    }

    @Query(() => Admin)
    fetchAdminOfTheStore(@Args('directStoreId') directStoreId: string) {
        return this.adminService.findOne({ directStoreId });
    }

    @Query(() => [Admin])
    fetchAdmins() {
      return this.adminService.findAll();
    }
}
