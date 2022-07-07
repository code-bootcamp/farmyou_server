import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardUgly } from '../boardUgly/entities/boardUgly.entity';
import { ImageUglyProduct } from '../imageUglyProduct/entities/imageUglyProduct.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { ProductUgly } from './entities/productUgly.entity';
import { ProductUglyResolver } from './productUgly.resolver';
import { ProductUglyService } from './productUgly.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductUgly, BoardUgly, ImageUglyProduct, Inquiry, Payment])],
  providers: [
    ProductUglyResolver, //
    ProductUglyService,
  ],
})
export class ProductUglyModule {}
