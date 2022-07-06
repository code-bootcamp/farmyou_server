import { Module } from '@nestjs/common';
import { ImageDirectProductResolver } from './imageDirectProduct.resolver';
import { ImageDirectProductService } from './imageDirectProduct.service';

@Module({
  providers: [
    ImageDirectProductResolver, //
    ImageDirectProductService,
  ],
})
export class ImageDirectProductModule {}
