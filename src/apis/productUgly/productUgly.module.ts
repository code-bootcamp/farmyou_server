import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUglyProduct } from '../imageUglyProduct/entities/imageUglyProduct.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from '../seller/entities/seller.entity';
import { ProductUgly } from './entities/productUgly.entity';
import { ProductUglyResolver } from './productUgly.resolver';
import { ProductUglyService } from './productUgly.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductUgly, ImageUglyProduct, Inquiry, Payment, Seller])],
  providers: [
    ProductUglyResolver, //
    ProductUglyService,
  ],
})
export class ProductUglyModule {}
