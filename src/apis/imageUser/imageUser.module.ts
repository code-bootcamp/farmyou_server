import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { ImageUser } from './entities/imageUser.entity';
import { ImageUserResolver } from './imageUser.resolver';
import { ImageUserService } from './imageUser.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageUser, User, Seller])],
  providers: [
    ImageUserResolver, //
    ImageUserService,
  ],
})
export class ImageUserModule {}
