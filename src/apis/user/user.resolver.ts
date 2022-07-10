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

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  // 회원 생성하기
  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);
    // console.log(hashedPassword);
    return this.userService.create({ email, name, hashedPassword, phone });
  }

  // 회원 정보 업데이트 하기 
  // @UseGuards(GqlAuthAccessGuard)
  // @Mutation(() => User)
  // async updateUser(
  //   // @Args({name: 'email', nullable: true}) email: string,
  //   // @Args({name: 'password', nullable: true}) password: string,
  //   // @Args({name: 'phone', nullable: true}) phone: string,
  //   @Args('updateUserInput') updateUserInput: UpdateUserInput,
  //   @Args('updateAddressUserInput') updateAddressUserInput: UpdateAddressUserInput,
  //   // @Args('updateUserInput') updateUserInput: UpdateUserInput,

  //   // @Args('password') password: string,
  // ) {
  //   const hashedPassword = await bcrypt.hash(updateUserInput.password, 10);
  //   return await this.userService.update({ updateUserInput, updateAddressUserInput });
  // }

  // TODO

  //currentUser 안에 id와 이메일이 있다

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  fetchUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    console.log('fetchUser 실행 완료!!!');
    console.log('유저정보는??!!!', currentUser);
    return 'qqq';
  }

  @Query(() => [User])
  fetchUsers() {
    return this.userService.findAll();
  }
}
