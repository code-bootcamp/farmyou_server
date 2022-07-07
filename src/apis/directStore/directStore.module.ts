import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectStore } from './entities/directStore.entity';
import { DirectStoreResolver } from './directStore.resolver';
import { DirectStoreService } from './directStore.service';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DirectStore, ProductDirect])],
  providers: [
    DirectStoreResolver, //
    DirectStoreService,
  ],
})
export class DirectStoreModule {}
