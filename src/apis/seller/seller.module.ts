import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { File } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { FileService } from '../file/file.service';
import { ImageUser } from '../imageUser/entities/imageUser.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from './entities/seller.entity';
import { SellerResolver } from './seller.resolver';
import { SellerService } from './seller.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Seller,
    Payment,
    ImageUser,
    Inquiry,
    File
  ])],
  providers: [
    JwtAccessStrategy,
    SellerResolver, //
    SellerService,
    FileResolver,
    FileService
  ],
})
export class SellerModule {}
