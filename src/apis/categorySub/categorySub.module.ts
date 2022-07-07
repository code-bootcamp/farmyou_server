import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySub } from './entities/categorySub.entity';
import { CategorySubResolver } from './categorySub.resolver';
import { CategorySubService } from './categorySub.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategorySub])],
  providers: [
    CategorySubResolver, //
    CategorySubService,
  ],
})
export class CategorySubModule {}
