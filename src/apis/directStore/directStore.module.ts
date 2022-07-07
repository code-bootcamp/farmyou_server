import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectStore } from './entities/directStore.entity';
import { DirectStoreResolver } from './directStore.resolver';
import { DirectStoreService } from './directStore.service';

@Module({
  imports: [TypeOrmModule.forFeature([DirectStore])],
  providers: [
    DirectStoreResolver, //
    DirectStoreService,
  ],
})
export class DirectStoreModule {}
