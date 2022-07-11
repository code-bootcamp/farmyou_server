import { PassportStrategy } from '@nestjs/passport';
import {Strategy} from 'passport-kakao';
import 'dotenv/config';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        const CLIENT_ID = process.env.KAKAO_CLIENT_ID;
        const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
        // const CLIENT_URL = process.env.KAKAO_CLIENT_URL;

        super({
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/login/kakao',
        });
    }

    validate(accessToken, refreshToken, profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
          email: profile._json.kakao_account.email,
          password: '12345678', //받아오는것이 없어서 임의로 정의 하는것
          name: profile.displayName,
          phone: '01012345678'
        };
      }
}