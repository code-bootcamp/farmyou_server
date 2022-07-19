import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/entities/admin.entity';
import { Category } from '../category/entities/category.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';
import { File } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { FileService } from '../file/file.service';
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
    DirectStore,
    Inquiry,
    Payment,
    User,
    Seller,
    File
  ])],
  providers: [
    ProductDirectResolver, //
    ProductDirectService,
    FileResolver,
    FileService,
  ],
})
export class ProductDirectModule {}
