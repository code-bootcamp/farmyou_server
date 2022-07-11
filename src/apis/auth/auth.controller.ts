import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: Pick<User, 'email' | 'password' | 'name' | 'phone'>;
}

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Get('/users/login/google') //현재 api의 엔드포인트
  @UseGuards(AuthGuard('google')) //그래프  ql이 아니기 때문에 다이렉트로 연결합니다.
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.loginSocial(req, res);
    // // 1. 가입확인
    // let user = await this.userService.findOne({ email: req.user.email });

    // // 2. 회원가입
    // if (!user) {
    //   user = await this.userService.create({
    //     email: req.user.email,
    //     hashedPassword: req.user.password,
    //     name: req.user.name,
    //     phone: req.user.phone,
    //   })
    // }
    // //3. 로그인
    // this.authService.setRefreshToken({ user, res });

    // res.redirect("http://localhost:5500/frontTest/social-login.test.html")
  }

  //naver 로그인
  @Get('/users/login/naver') //현재 api의 엔드포인트
  @UseGuards(AuthGuard('naver')) //그래프  ql이 아니기 때문에 다이렉트로 연결합니다.
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.loginSocial(req, res);
  }

  //카카오 로그인
  @Get('/users/login/kakao') //현재 api의 엔드포인트
  @UseGuards(AuthGuard('kakao')) //그래프  ql이 아니기 때문에 다이렉트로 연결합니다.
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.loginSocial(req, res);
  }
}
