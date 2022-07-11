import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { AddressUserService } from '../addressUser/addressUser.service';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { BoardDirect } from '../boardDirect/entities/boardDirect.entity';
import { BoardUgly } from '../boardUgly/entities/boardUgly.entity';
import { ImageUser } from '../imageUser/entities/imageUser.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    AddressUser,
    Payment,
    ImageUser,
    Inquiry,
    BoardUgly,
    BoardDirect])],
  providers: [
    JwtAccessStrategy,
    UserResolver, //
    UserService,
    AddressUserService
  ],
})
export class UserModule {}
