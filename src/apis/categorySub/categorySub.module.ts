import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySub } from './entities/categorySub.entity';
import { CategorySubResolver } from './categorySub.resolver';
import { CategorySubService } from './categorySub.service';
import { CategoryMain } from '../categoryMain/entities/categoryMain.entity';
import { CategoryDetailed } from '../categoryDetailed/entities/categoryDetailed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategorySub, CategoryMain, CategoryDetailed])],
  providers: [
    CategorySubResolver, //
    CategorySubService,
  ],
})
export class CategorySubModule {}
