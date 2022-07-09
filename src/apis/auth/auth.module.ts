import { CacheModule, Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    CacheModule.register(),
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthResolver, //
    AuthService,
    UserService,
  ],
})
export class AuthModule {}
