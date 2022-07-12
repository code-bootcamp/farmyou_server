import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UpdateAdminInput } from './dto/updateAdmin.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';

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
  @Mutation(() => Admin)
  async createAdmin(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('directStoreId') directStoreId: DirectStore,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);
    // console.log(hashedPassword);
    return this.adminService.create({ email, hashedPassword, directStoreId });
  }

  // 회원 정보 업데이트 하기 
  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => Admin)
  // async updateAdmin(
  //   @CurrentUser() currentUser: ICurrentUser,
  //   @Args({name: 'email', nullable: true}) email: string,
  //   @Args({name: 'password', nullable: true}) password: string,
  //   @Args({name: 'phone', nullable: true}) phone: string,
  //   @Args({name: 'newAddress', nullable: true}) newAddress: UpdateAddressAdminInput
  //   // @Args('updateAdminInput') updateAdminInput: UpdateAdminInput,
  //   // @Args('updateAddressAdminInput') updateAddressAdminInput: UpdateAddressAdminInput,
  //   // @Args('updateAdminInput') updateAdminInput: UpdateAdminInput,

  //   // @Args('password') password: string,
  // ) {
  //   // const hashedPassword = await bcrypt.hash(password, 10);
  //   return await this.adminService.update({ currentUser, email, password, phone, newAddress });
  // }

  // @UseGuards(GqlAuthAccessGuard)
  // @Query(() => Admin)
  // checkValidAdmin(
  //   @Args('password') password: string
  // ) {
  //   const loggedAdminPwd = this.fetchAdmin()
  // }

  @Query(() => Admin)
  fetchAdminOfTheStore(
    @Args('directStoreId') directStoreId: string
  ) {
    return this.adminService.findOne({directStoreId});
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Admin)
  fetchAdminLoggedIn(
    @CurrentUser() currentUser: ICurrentUser
  ) {
    return this.adminService.findLoggedIn({ currentUser });
  }

  // PasswordCheckModal
  // @UseGuards(GqlAuthAccessGuard)
  // @Query(() => Boolean)
  // async checkIfLoggedAdmin(
  //   @CurrentUser() currentUser: ICurrentUser,
  //   @Args('passwordFirst') passwordFirst: string,
  //   @Args('passwordSecond') passwordSecond: string
  // ) {
  //   // const correctPassword = currentUser.password;
  //   // console.log(currentUser);
  //   if (passwordFirst === passwordSecond) {
  //     const passwordOwner = await this.adminRepository.findOne({id: currentUser.id});
  //     const correctPassword = passwordOwner.password;
  
  //     // console.log(passwordOwner);
  //     // console.log(correctPassword);
  //     // console.log(await bcrypt.hash(password, 10));
  
  //     const same = bcrypt.compare(passwordFirst, correctPassword);
  
  //     return same;
  //   } else {
  //     return false;
  //   }
  // }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => Admin)
  // async updateImage(
  //   @Args('image') image: string,
  //   @CurrentUser() currentUser: ICurrentUser,
  // ) {
  //   return this.adminService.updateImage({ image, currentUser });
  // }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => Admin)
  // async updateProfile(
  //   @Args('profile') profile: string,
  //   @CurrentUser() currentUser: ICurrentUser,
  // ) {
  //   return this.adminService.updateProfile({ profile, currentUser });
  // }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => Admin)
  // async updateAdmin(
  //   @CurrentUser() currentUser: ICurrentUser,
  //   @Args('updateAdminInput') updateAdminInput: UpdateAdminInput,
  //   @Args('updateAddressAdminInput') updateAddressAdminInput: UpdateAddressAdminInput,
  // ) {
  //   return await this.adminService.update({
  //     email: currentUser.email,
  //     updateAdminInput,
  //     updateAddressAdminInput
  //   });
  // }
}
