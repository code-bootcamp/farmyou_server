import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
      @Inject(CACHE_MANAGER)
      private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');

        return refreshToken;
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true
    });
  }

  async validate(req, payload) {
    console.log(req.headers.authorization)
    const RT = req.headers.cookie.split('Token=')[1]

    await this.cacheManager.get(`R ${RT}`)
    


    console.log(payload); // { email: c@c.com, sub: qkwefuasdij-012093sd }
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
