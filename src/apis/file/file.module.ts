import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { File } from './entities/file.entity';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([File, ProductDirect, ProductUgly, User, Seller])],
  providers: [
    FileResolver, //
    FileService,
  ],
})
export class FileModule {}