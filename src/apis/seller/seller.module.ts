import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { ImageUser } from '../imageUser/entities/imageUser.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from './entities/seller.entity';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Seller,
    Payment,
    ImageUser,
    Inquiry,
  ])],
  providers: [
    JwtAccessStrategy,
    SellerResolver, //
    SellerService,
  ],
})
export class SellerModule {}
