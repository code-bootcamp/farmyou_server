import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UpdateUserInput } from './dto/updateUser.input';
import { UpdateAddressUserInput } from '../addressUser/dto/updateAddressUser.input';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { CreateAddressUserInput } from '../addressUser/dto/createAddressUser.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver()
export class UserResolver {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UserService, //
  ) {}

  // 회원 생성하기
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
    @Args('addressUser') addressUser: CreateAddressUserInput,
    @Args('isSeller') isSeller: boolean
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);
    // console.log(hashedPassword);
    return this.userService.create({ email, name, hashedPassword, phone, addressUser, isSeller });
  }

  // 회원 정보 업데이트 하기 
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: ICurrentUser,
    @Args({name: 'email', nullable: true}) email: string,
    @Args({name: 'password', nullable: true}) password: string,
    @Args({name: 'phone', nullable: true}) phone: string,
    @Args({name: 'newAddress', nullable: true}) newAddress: UpdateAddressUserInput
    // @Args('updateUserInput') updateUserInput: UpdateUserInput,
    // @Args('updateAddressUserInput') updateAddressUserInput: UpdateAddressUserInput,
    // @Args('updateUserInput') updateUserInput: UpdateUserInput,

    // @Args('password') password: string,
  ) {
    // const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userService.update({ currentUser, email, password, phone, newAddress });
  }

  // @UseGuards(GqlAuthAccessGuard)
  // @Query(() => User)
  // checkValidUser(
  //   @Args('password') password: string
  // ) {
  //   const loggedUserPwd = this.fetchUser()
  // }

  // 쓸모 없을 듯
  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUserLoggedIn(
    @CurrentUser() currentUser: ICurrentUser
  ) {
    return this.userService.findLoggedIn({ currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean)
  async checkIfLogged(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('password') password: string
  ) {
    // const correctPassword = currentUser.password;
    // console.log(currentUser);
    const passwordOwner = await this.userRepository.findOne({id: currentUser.id});
    const correctPassword = passwordOwner.password;

    // console.log(passwordOwner);
    // console.log(correctPassword);
    // console.log(await bcrypt.hash(password, 10));

    const same = bcrypt.compare(password, correctPassword);

    return same;
  }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => User)
  // async updateImage(
  //   @Args('image') image: string,
  //   @CurrentUser() currentUser: ICurrentUser,
  // ) {
  //   return this.userService.updateImage({ image, currentUser });
  // }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => User)
  // async updateProfile(
  //   @Args('profile') profile: string,
  //   @CurrentUser() currentUser: ICurrentUser,
  // ) {
  //   return this.userService.updateProfile({ profile, currentUser });
  // }

  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => User)
  // async updateUser(
  //   @CurrentUser() currentUser: ICurrentUser,
  //   @Args('updateUserInput') updateUserInput: UpdateUserInput,
  //   @Args('updateAddressUserInput') updateAddressUserInput: UpdateAddressUserInput,
  // ) {
  //   return await this.userService.update({
  //     email: currentUser.email,
  //     updateUserInput,
  //     updateAddressUserInput
  //   });
  // }
}