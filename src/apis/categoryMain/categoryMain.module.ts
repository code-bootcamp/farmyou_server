import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryMain } from './entities/categoryMain.entity';
import { CategoryMainResolver } from './categoryMain.resolver';
import { CategoryMainService } from './categoryMain.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryMain])],
  providers: [
    CategoryMainResolver, //
    CategoryMainService,
  ],
})
export class CategoryMainModule {}
