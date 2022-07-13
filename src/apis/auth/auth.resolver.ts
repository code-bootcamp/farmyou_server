import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import { GqlAuthRefreshGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser } from "src/commons/auth/gql-user.param";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import * as jwt from "jsonwebtoken";
import { Cache } from "cache-manager";
import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { SellerService } from "../seller/seller.service";
import { AdminService } from "../admin/admin.service";

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,
    private readonly sellerService: SellerService,
    private readonly adminService: AdminService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  @Mutation(() => String)
  async login(
    @Args("email") email: string, //
    @Args("password") password: string,
    @Args("userType") userType: string,
    @Context() context: any
  ) {
    // 1. 로그인(이메일과 비밀번호가 일치하는 유저를 DB에서 찾기)
    if (userType === "user") {
      const user = await this.userService.findOne({ email });
  
      // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
      if (!user) throw new UnprocessableEntityException("이메일이 없습니다.");
  
      // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?! 에러 던지기!!!
      const isAuth = await bcrypt.compare(password, user.password);
      if (!isAuth) throw new UnprocessableEntityException("암호가 틀렸습니다.");
  
      // 4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
      context.res;
      this.authService.setRefreshToken({ user, res: context.req.res });
  
      // 4. 일치하는 유저가 있으면?! accessToken(=JWT)을 만들어서 브라우저에 전달하기
      return this.authService.getAccessToken({ user });

    } else if (userType === "seller") {

      const user = await this.sellerService.findOne({ email });
  
      // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
      if (!user) throw new UnprocessableEntityException("이메일이 없습니다.");
  
      // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?! 에러 던지기!!!
      const isAuth = await bcrypt.compare(password, user.password);
      if (!isAuth) throw new UnprocessableEntityException("암호가 틀렸습니다.");
  
      // 4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
      context.res;
      this.authService.setRefreshToken({ user, res: context.req.res });
  
      // 4. 일치하는 유저가 있으면?! accessToken(=JWT)을 만들어서 브라우저에 전달하기
      return this.authService.getAccessToken({ user });

    } else if (userType === "admin") {
      
      const user = await this.adminService.findOneByEmail({ email });

      // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
      if (!user) throw new UnprocessableEntityException("이메일이 없습니다.");

      // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?! 에러 던지기!!!
      const isAuth = await bcrypt.compare(password, user.password);
      if (!isAuth) throw new UnprocessableEntityException("암호가 틀렸습니다.");

      // 4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
      context.res;
      this.authService.setRefreshToken({ user, res: context.req.res });

      // 4. 일치하는 유저가 있으면?! accessToken(=JWT)을 만들어서 브라우저에 전달하기
      return this.authService.getAccessToken({ user });
    }
  }

  @Mutation(() => String)
  async logout(@Context() context: any) {
    // console.log("=============================================================");
    // console.log("refresh is ", context.req.headers.cookie);
    // console.log("=============================================================");
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    )
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      ''
    )
    
    try {
      jwt.verify(accessToken, "myAccessKey");
      jwt.verify(refreshToken, "myRefreshKey");

      // JWT의 payload나 거기 있는 exp를 어떻게 이용하는 지 모르겠음...
      await this.cacheManager.set(accessToken, "accessToken", { ttl: 120 });
      await this.cacheManager.set(refreshToken, "refreshToken", { ttl: 12000 });

      return "로그아웃에 성공했습니다.";
    } catch (error) {
      throw new UnauthorizedException("Unauthorized");
    }
  }

  // GqlAuthAccessGuard is 
// import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';imported from src/commons/auth/gql-auth.guard.ts
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@CurrentUser() currentUser: any) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
