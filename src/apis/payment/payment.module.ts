import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, ProductDirect, ProductUgly])],
  providers: [
    PaymentResolver, //
    PaymentService,
  ],
})
export class PaymentMoudle {}
