import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UpdateUserInput } from './dto/updateUser.input';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService, //
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('name') name: string,
    @Args('password') password: string,
    @Args('phone') phone: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10.2);
    console.log(hashedPassword);
    return this.userService.create({ email, name, hashedPassword, phone });
  }

  // 로그인한 유저의 정보 업데이트, 비밀번호까지
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Args('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return await this.userService.update({email, updateUserInput, hashedPassword})

  }

  // TODO
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  fetchUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    console.log('fetchUser 실행 완료!!!');
    console.log('유저정보는??!!!', currentUser);
    return 'qqq';
  }
}
