import { Module } from '@nestjs/common';
import { ImageUglyProductResolver } from './imageUglyProduct.resolver';
import { ImageUglyProductService } from './imageUglyProduct.service';

@Module({
  providers: [
    ImageUglyProductResolver, //
    ImageUglyProductService,
  ],
})
export class ImageUglyProductModule {}
