import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressUserService } from '../addressUser/addressUser.service';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { Admin } from '../admin/entities/admin.entity';
import { AuthService } from '../auth/auth.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryResolver } from './inquiry.resolver';
import { InquiryService } from './inquiry.service';

@Module({
    imports: [TypeOrmModule.forFeature([
        Inquiry, 
        User, 
        ProductDirect, 
        ProductUgly, 
        Seller,
        Admin,
        AddressUser,
    ])],
  providers: [
    InquiryResolver, //
    InquiryService,
    AuthService,
    JwtService,
    UserService,
    AddressUserService,
    Object
  ],
})
export class InquiryModule {}
