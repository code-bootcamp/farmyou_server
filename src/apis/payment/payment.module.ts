import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressUserService } from '../addressUser/addressUser.service';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { Admin } from '../admin/entities/admin.entity';
import { File } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { FileService } from '../file/file.service';
import { IamportService } from '../iamport/iamport.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Payment, 
    User,
    Seller,
    Admin,
    ProductUgly,
    ProductDirect,
    AddressUser,
    File
  ])],
  providers: [
    PaymentResolver, //
    PaymentService,
    IamportService,
    UserService,
    AddressUserService,
    FileResolver,
    FileService
  ],
})
export class PaymentMoudle {}
