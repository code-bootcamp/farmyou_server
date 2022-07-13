import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { AddressUserService } from '../addressUser/addressUser.service';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { ImageUser } from '../imageUser/entities/imageUser.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Admin } from './entities/admin.entity';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { Seller } from '../seller/entities/seller.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Admin,
    AddressUser,
    Payment,
    ImageUser,
    Inquiry,
    Seller,
    DirectStore
  ])],
  providers: [
    JwtAccessStrategy,
    AdminResolver, //
    AdminService,
    AddressUserService
  ],
})
export class AdminModule {}
