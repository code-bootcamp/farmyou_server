import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/entities/admin.entity';
import { Category } from '../category/entities/category.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';
import { ImageDirectProduct } from '../imageDirectProduct/entities/imageDirectProduct.entity';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { ProductDirect } from './entities/productDirect.entity';
import { ProductDirectResolver } from './productDirect.resolver';
import { ProductDirectService } from './productDirect.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Admin,
    ProductDirect, 
    Category, 
    ImageDirectProduct, 
    DirectStore,
    Inquiry,
    Payment,
    User,
    Seller
  ])],
  providers: [
    ProductDirectResolver, //
    ProductDirectService,
  ],
})
export class ProductDirectModule {}
