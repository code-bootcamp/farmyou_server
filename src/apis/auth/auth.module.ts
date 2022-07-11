import { CacheModule, Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import {JwtGoogleStrategy} from 'src/commons/auth/jwt-social-google.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { AddressUserService } from '../addressUser/addressUser.service';


@Module({
  imports: [
    CacheModule.register(),
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User, AddressUser]),
  ],
  providers: [
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtNaverStrategy,
    JwtKakaoStrategy,
    AuthResolver, //
    AuthService,
    UserService,
    AddressUserService
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
