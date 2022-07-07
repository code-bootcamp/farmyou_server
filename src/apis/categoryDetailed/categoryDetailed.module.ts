import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryDetailed } from './entities/categoryDetailed.entity';
import { CategoryDetailedResolver } from './categoryDetailed.resolver';
import { CategoryDetailedService } from './categoryDetailed.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryDetailed])],
  providers: [
    CategoryDetailedResolver, //
    CategoryDetailedService,
  ],
})
export class CategoryDetailedModule {}
