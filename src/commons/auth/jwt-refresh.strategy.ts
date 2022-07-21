// import { CACHE_MANAGER, Inject } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-jwt';
// import { Cache } from 'cache-manager';

// export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
//   constructor(
//       @Inject(CACHE_MANAGER)
//       private readonly cacheManager: Cache,
//   ) {
//     super({
//       jwtFromRequest: (req) => {
//         const cookie = req.headers.cookie;
//         const refreshToken = cookie.replace('refreshToken=', '');

//         return refreshToken;
//       },
//       secretOrKey: 'myRefreshKey',
//       passReqToCallback: true
//     });
//   }

//   async validate(req, payload) {
//     try {
//     const RT = req.headers.cookie.split('Token=')[1]
//     console.log(RT)
//     const result = await this.cacheManager.get(`refreshToken:${RT}`)
//     console.log(result)
//     if(result) return '잘못된 토큰입니다.'
//     } catch {
//       return '잘못된 토큰입니다.'
//     } 
    
    


//     console.log(payload); // { email: c@c.com, sub: qkwefuasdij-012093sd }
//     return {
//       email: payload.email,
//       id: payload.sub,
//     };
//   }
// }

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      //인가에 성공하면 아래의 validate가 작동합니다.
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        if (cookie) return cookie.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const refreshToken = await req.headers.cookie.replace('refreshToken=', '');
    const is_refreshToken = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );

    if (is_refreshToken) throw new UnauthorizedException();

    console.log(payload); // email: c@c.com, sub: woiejfoiwf-12314sd
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
