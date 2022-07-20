import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import 'dotenv/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        const CLIENT_ID = process.env.KAKAO_CLIENT_ID;
        const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
        // const CLIENT_URL = process.env.KAKAO_CLIENT_URL;

        super({
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: 'https://farmback.shop/users/login/kakao',
        });
    }


    validate(accessToken, refreshToken, profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
          email: profile._json.kakao_account.email,
          password: '카카오로그인유저', //받아오는것이 없어서 임의로 정의 하는것
          name: profile.displayName,
          phone: '핸드폰번호를 추가해주세요',
          addressUser: null,
          files: null,
        };
      }
}