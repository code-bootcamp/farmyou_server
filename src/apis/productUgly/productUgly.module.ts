import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUgly } from './entities/productUgly.entity';
import { ProductUglyResolver } from './productUgly.resolver';
import { ProductUglyService } from './productUgly.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductUgly])],
  providers: [
    ProductUglyResolver, //
    ProductUglyService,
  ],
})
export class ProductUglyModule {}
