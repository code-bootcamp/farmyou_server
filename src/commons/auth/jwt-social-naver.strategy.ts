import { PassportStrategy } from '@nestjs/passport';
// import { Profile, Strategy } from 'passport-google-oauth20';
import 'dotenv/config';
import { Strategy } from 'passport-naver-v2';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        const CLIENT_ID = process.env.NAVER_CLIENT_ID;
        const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

        super({
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/users/login/naver',
        });
    }

    validate(accessToken, refreshToken, profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
          email: profile.email,
          password: '네이버로그인유저', //받아오는것이 없어서 임의로 정의 하는것
          // name: profile.displayName,
          name: profile.name,
          phone: '핸드폰번호를 추가해주세요',
          addressUser: null,
          files: null,
        };
      }
}