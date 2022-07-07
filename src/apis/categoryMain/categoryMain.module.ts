import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryMain } from './entities/categoryMain.entity';
import { CategoryMainResolver } from './categoryMain.resolver';
import { CategoryMainService } from './categoryMain.service';
import { CategorySub } from '../categorySub/entities/categorySub.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryMain, CategorySub])],
  providers: [
    CategoryMainResolver, //
    CategoryMainService,
  ],
})
export class CategoryMainModule {}
