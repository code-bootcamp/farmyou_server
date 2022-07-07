import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDirect } from './entities/productDirect.entity';
import { ProductDirectResolver } from './productDirect.resolver';
import { ProductDirectService } from './productDirect.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDirect])],
  providers: [
    ProductDirectResolver, //
    ProductDirectService,
  ],
})
export class ProductDirectModule {}
