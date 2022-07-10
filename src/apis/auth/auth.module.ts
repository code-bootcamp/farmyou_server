import { CacheModule, Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { AddressUserService } from '../addressUser/addressUser.service';

@Module({
  imports: [
    CacheModule.register(),
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User, AddressUser]),
  ],
  providers: [
    AuthResolver, //
    AuthService,
    UserService,
    AddressUserService
  ],
})
export class AuthModule {}
