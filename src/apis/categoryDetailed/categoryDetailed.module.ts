import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryDetailed } from './entities/categoryDetailed.entity';
import { CategoryDetailedResolver } from './categoryDetailed.resolver';
import { CategoryDetailedService } from './categoryDetailed.service';
import { CategorySub } from '../categorySub/entities/categorySub.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryDetailed, CategorySub])],
  providers: [
    CategoryDetailedResolver, //
    CategoryDetailedService,
  ],
})
export class CategoryDetailedModule {}
