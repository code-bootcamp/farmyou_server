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

            // scope: ['name', 'nickname', 'email', 'mobile']
        });
    }

    validate(accessToken, refreshToken, profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
          email: profile.email,
          password: '12345678', //받아오는것이 없어서 임의로 정의 하는것
          // name: profile.displayName,
          name: profile.name,
          phone: '01012345678',
          addressUser: null,
          files: null,
        };
      }
}