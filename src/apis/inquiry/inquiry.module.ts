import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
// import { Response } from '../response/entities/response.entity';
import { User } from '../user/entities/user.entity';
import { Inquiry } from './entities/inquiry.entity';
import { InquiryResolver } from './inquiry.resolver';
import { InquiryService } from './inquiry.service';

@Module({
    imports: [TypeOrmModule.forFeature([Inquiry, User, ProductDirect, ProductUgly])],
  providers: [
    InquiryResolver, //
    InquiryService,
  ],
})
export class InquiryModule {}
