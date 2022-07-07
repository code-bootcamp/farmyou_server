import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { ImageUglyProduct } from './entities/imageUglyProduct.entity';
import { ImageUglyProductResolver } from './imageUglyProduct.resolver';
import { ImageUglyProductService } from './imageUglyProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageUglyProduct, ProductUgly])],
  providers: [
    ImageUglyProductResolver, //
    ImageUglyProductService,
  ],
})
export class ImageUglyProductModule {}
