import { Module } from '@nestjs/common';
import { ImageUserResolver } from './imageUser.resolver';
import { ImageUserService } from './imageUser.service';

@Module({
  providers: [
    ImageUserResolver, //
    ImageUserService,
  ],
})
export class ImageUserModule {}
