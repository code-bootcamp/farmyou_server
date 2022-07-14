import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { SellerService } from '../seller/seller.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService, //
    private readonly userService: UserService,
  ) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );

    // 개발환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
    // cros 오류
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.garbi.shop; SameSite=None; Secure; httpOnly;`,
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
  }
  
  // //소셜 로그인
  // async loginSocial(req, res) {
  //   let user = await this.userService.findOne({ email: req.user.email });

  //   const hashedPassword = await bcrypt.hash(req.user.password, 10); // 비밀번호 숨겨서 보내기
  //   // 2. 회원가입
  //   if (!user) {
  //     user = await this.userService.create({
  //       email: req.user.email,
  //       hashedPassword,
  //       name: req.user.name,
  //       phone: req.user.phone,
  //       addressUser: null
  //     });
  //   }

  //   getAccessToken({ user }) {
  //       return this.jwtService.sign(
  //           { email: user.email, sub: user.id },
  //           { secret: 'myAccessKey', expiresIn: '1h' },
  //       );
  //   }

    //소셜 로그인
    async loginSocial(req, res) {
        let user = await this.userService.findOne({ email: req.user.email });

        const hashedPassword = await bcrypt.hash(req.user.password, 10); // 비밀번호 숨겨서 보내기

        // 2. 회원가입
        if (!user) {
            user = await this.userService.create({
                email: req.user.email,
                hashedPassword,
                name: req.user.name,
                phone: req.user.phone,
                addressUser: null,
            });
        }

        //3. 로그인
        await this.setRefreshToken({ user, res });

        res.redirect('http://localhost:5500/frontTest/social-login.test.html');
    }
}

