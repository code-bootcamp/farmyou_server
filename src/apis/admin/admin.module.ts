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
import { Admin } from './entities/admin.entity';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Admin,
    AddressUser,
    Payment,
    ImageUser,
    Inquiry,
    BoardUgly,
    BoardDirect])],
  providers: [
    JwtAccessStrategy,
    AdminResolver, //
    AdminService,
    AddressUserService
  ],
})
export class UserModule {}
