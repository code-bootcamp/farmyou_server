// import { PassportStrategy } from '@nestjs/passport';
// // import { Profile, Strategy } from 'passport-google-oauth20';
// import 'dotenv/config';
// import { Strategy } from 'passport-naver-v2';

// export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
//     constructor() {
//         const CLIENT_ID = process.env.NAVER_CLIENT_ID;
//         const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

//         super({
//             clientID: CLIENT_ID,
//             clientSecret: CLIENT_SECRET,
//             callbackURL: "http://localhost:3000/login/naver",
//             scope: ['name', 'nickname', 'email', 'mobile']
//         });
//     }

//     validate(accessToken, refreshToken, profile) {
//         // console.log(profile);
//         return {
//             password: "1234",               // 임의의 패스워드
//             address: "서울시 서울구 서울동",    // 임의의 주소
//             email: profile.email,
//             contact: profile.mobile,
//             name: profile.name
//         }
//     }
// }