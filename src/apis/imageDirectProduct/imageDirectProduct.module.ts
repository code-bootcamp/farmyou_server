import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ImageDirectProduct } from './entities/imageDirectProduct.entity';
import { ImageDirectProductResolver } from './imageDirectProduct.resolver';
import { ImageDirectProductService } from './imageDirectProduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageDirectProduct, ProductDirect])],
  providers: [
    ImageDirectProductResolver, //
    ImageDirectProductService,
  ],
})
export class ImageDirectProductModule {}
