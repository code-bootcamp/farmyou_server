import { PassportStrategy } from '@nestjs/passport';
import {Strategy} from 'passport-kakao';
import 'dotenv/config';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        const CLIENT_ID = process.env.KAKAO_CLIENT_ID;
        const CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

        super({
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: "http://localhost:3000/login/kakao",
            scope: ['profile_nickname', 'account_email']
        });
    }

    validate(accessToken, refreshToken, profile) {
        // console.log(profile);
        return {
            email: profile._json.kakao_account.email,
            password: "1234",                   // 임의의 패스워드
            address: "서울시 서울구 서울동",        // 임의의 주소
            contact: "01012345678",             // 임의의 휴대폰 번호
            name: profile.username
        }
    }
}