import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressUserService } from '../addressUser/addressUser.service';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { File } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';
import { FileService } from '../file/file.service';
import { IamportService } from '../iamport/iamport.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductDirectService } from '../productDirect/productDirect.service';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { ProductUglyService } from '../productUgly/productUgly.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Payment, 
    User,
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
    // ProductUglyService,
    // ProductDirectService
  ],
})
export class PaymentMoudle {}
