import {
    UnauthorizedException,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import {
    GqlAuthAccessGuard,
    GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { SellerService } from '../seller/seller.service';
import { AdminService } from '../admin/admin.service';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admin/entities/admin.entity';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService, //
        private readonly authService: AuthService,
        private readonly sellerService: SellerService,
        private readonly adminService: AdminService,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    @Mutation(() => String,
    { description: '사용자 로그인' },)
    async loginUser(
        @Args('email') email: string, //
        @Args('password') password: string,
        @Context() context: any,
    ) {
        // 1. 로그인(이메일과 비밀번호가 일치하는 유저를 DB에서 찾기)
        const user = await this.userService.findOne({ email });

        // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
        if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

        console.log(user);
        // console.log(user.password);

        // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?! 에러 던지기!!!
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth)
            throw new UnprocessableEntityException('암호가 틀렸습니다.');

        // 4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
        context.res;
        this.authService.setRefreshToken({ user, res: context.req.res });

        // 4. 일치하는 유저가 있으면?! accessToken(=JWT)을 만들어서 브라우저에 전달하기
        return this.authService.getAccessToken({ user });
    }

    @Mutation(() => String,
    { description: '판매자 로그인' },)
    async loginSeller(
        @Args('email') email: string, //
        @Args('password') password: string,
        @Context() context: any,
    ) {
        // 1. 로그인(이메일과 비밀번호가 일치하는 유저를 DB에서 찾기)
        const seller = await this.sellerService.findOne({ email });

        // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
        if (!seller)
            throw new UnprocessableEntityException('이메일이 없습니다.');

        // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?! 에러 던지기!!!
        const isAuth = await bcrypt.compare(password, seller.password);
        if (!isAuth)
            throw new UnprocessableEntityException('암호가 틀렸습니다.');

        // 4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
        context.res;
        this.authService.setRefreshToken({
            user: seller,
            res: context.req.res,
        });

        // 4. 일치하는 유저가 있으면?! accessToken(=JWT)을 만들어서 브라우저에 전달하기
        return this.authService.getAccessToken({ user: seller });
    }

    @Mutation(() => String,
    { description: '관리자 로그인' },)
    async loginAdmin(
        @Args('email') email: string, //'myAccessKey
        @Args('password') password: string,
        @Context() context: any,
    ) {
        const admin = await this.adminService.findOneByEmail({ email });

        // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
        if (!admin)
            throw new UnprocessableEntityException('이메일이 없습니다.');

        // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?! 에러 던지기!!!
        const isAuth = await bcrypt.compare(password, admin.password);
        if (!isAuth)
            throw new UnprocessableEntityException('암호가 틀렸습니다.');

        // 4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
        context.res;
        this.authService.setRefreshToken({ user: admin, res: context.req.res });

        // 4. 일치하는 유저가 있으면?! accessToken(=JWT)을 만들어서 브라우저에 전달하기
        return this.authService.getAccessToken({ user: admin });
    }

    // @Mutation(() => String)
    // async logout(@Context() context: any) {
    //     // console.log("=============================================================");
    //     // console.log("refresh is ", context.req.headers.cookie);
    //     // console.log("=============================================================");
    //     const accessToken = context.req.headers.authorization.replace(
    //         'Bearer ',
    //         '',
    //     );
    //     const refreshToken = context.req.headers.cookie.replace(
    //         'refreshToken=',
    //         '',
    //     );

    //     try {
    //         jwt.verify(accessToken, 'myAccessKey');
    //         jwt.verify(refreshToken, 'myRefreshKey');

    //         // JWT의 payload나 거기 있는 exp를 어떻게 이용하는 지 모르겠음...
    //         await this.cacheManager.set(accessToken, 'accessToken', {
    //             ttl: 120,
    //         });
    //         await this.cacheManager.set(refreshToken, 'refreshToken', {
    //             ttl: 12000,
    //         });

    //         return '로그아웃에 성공했습니다.';
    //     } catch (error) {
    //         throw new UnauthorizedException('Unauthorized');
    //     }
    // }

    // // from BE1
    // @UseGuards(GqlAuthRefreshGuard)
    // @UseGuards(GqlAuthAccessGuard)
    // @Mutation(() => String)
    // async logout(@Context() context: any) {
    //   try {
    //     let RT = context.req.headers.cookie.split('Token=')[1];
    //     console.log(RT)
    //     let AT = context.req.headers.authorization.split(' ')[1];
    //     // let tem = Math.floor(Date.now() / 1000);
  
    //     jwt.verify(RT, 'myRefreshKey', async (err, payload) => {
    //       if (err) {
    //         throw err;
    //       }
    //       await this.cacheManager.set(`R ${RT}`, 'RefreshToken', {
    //         ttl: 28800,
    //       });
    //     });
  
    //     jwt.verify(AT, 'myAccessKey', async (err, payload) => {
    //       if (err) {
    //         console.log(err, '*******');
    //         throw err;
    //       }
    //       await this.cacheManager.set(`A ${AT}`, 'AccessToken', {
    //         ttl: 3600,
    //       });
    //     });
  
    //     return '로그아웃에 성공했습니다.';
    //   } catch (error) {
    //     console.log(error, ' !!! ');
    //     throw error;
    //   }
    // }

    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => String,
    { description: '로그아웃 (로그인 필요)' },)
    async logout(
        @Context() context: any, //
    ) {
        try{
            //accessToken값
        const accessToken = context.req.headers.authorization.replace(
        'Bearer ',
        '',
        );
        //refreshToken
        const refreshToken = context.req.headers.cookie.replace(
        'refreshToken=',
        '',
        );
        try {
        jwt.verify(accessToken, 'myAccessKey');
        jwt.verify(refreshToken, 'myRefreshKey');
        } catch {
        throw new UnauthorizedException();
        }
        await this.cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {ttl: 180});
        console.log(refreshToken)
        await this.cacheManager.set(`refreshToken:${refreshToken}`,'refreshToken', { ttl: 300 });

        return '로그아웃에 성공했습니다';
        }catch(error){

        }
            
        
        
    }

    // GqlAuthAccessGuard is imported from src/commons/auth/gql-auth.guard.ts
    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => String)
    restoreAccessToken(@CurrentUser() currentUser: any) {
        return this.authService.getAccessToken({ user: currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => String)
    fetchTypeOfUserLoggedIn(@CurrentUser() currentUser: ICurrentUser) {
        return this.authService.findLoggedInType({ currentUser });
    }

    // @UseGuards(GqlAuthAccessGuard)
    // // @Query(() => User || Seller || Admin)
    // @Query(() => Admin || Seller || User)
    // fetchUserLoggedIn(@CurrentUser() currentUser: ICurrentUser) {
    //     return this.authService.findLoggedIn({ currentUser });
    // }

    @UseGuards(GqlAuthRefreshGuard)
    // @Query(() => User || Seller || Admin)
    @Query(() => Admin || Seller || User)
    fetchUserLoggedIn(@CurrentUser() currentUser: ICurrentUser) {
        return this.authService.findLoggedIn({ currentUser });
    }
}
