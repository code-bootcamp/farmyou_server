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

@Resolver()
export class SellerResolver {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    private readonly sellerService: SellerService, //
  ) {}

  // 회원 생성하기
  @Mutation(() => Seller)
  async createSeller(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);
    // console.log(hashedPassword);
    return this.sellerService.create({ name, email, hashedPassword, phone });
  }

  // 회원 정보 업데이트 하기 
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Seller)
  async updateSeller(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({name: 'email', nullable: true}) email: string,
    @Args({name: 'password', nullable: true}) password: string,
    @Args({name: 'phone', nullable: true}) phone: string,
  ) {
    // const hashedPassword = await bcrypt.hash(password, 10);
    return await this.sellerService.update({ currentUser, email, password, phone});
  }

  // 쓸모 없을 듯
  @Query(() => [Seller])
  fetchSellers() {
    return this.sellerService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Seller)
  fetchSellerLoggedIn(
    @CurrentUser() currentUser: ICurrentUser
  ) {
    return this.sellerService.findLoggedIn({ currentUser });
  }

  // PasswordCheckModal
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean)
  async checkIfLoggedSeller(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('passwordFirst') passwordFirst: string,
    @Args('passwordSecond') passwordSecond: string
  ) {
    if (passwordFirst === passwordSecond) {
      const passwordOwner = await this.sellerRepository.findOne({id: currentUser.id});
      const correctPassword = passwordOwner.password;
  
      const same = bcrypt.compare(passwordFirst, correctPassword);
  
      return same;
    } else {
      return false;
    }
  }
}
