import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { FileService } from '../file/file.service';
import { ImageUglyProduct } from '../imageUglyProduct/entities/imageUglyProduct.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { ProductUgly } from './entities/productUgly.entity';
import { ProductUglyResolver } from './productUgly.resolver';
import { ProductUglyService } from './productUgly.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductUgly,
            ImageUglyProduct,
            Inquiry,
            Payment,
            Seller,
            User,
            File,
        ]),
    ],
    providers: [
        ProductUglyResolver, //
        ProductUglyService,
        FileResolver,
        FileService,
    ],
})
export class ProductUglyModule {}
