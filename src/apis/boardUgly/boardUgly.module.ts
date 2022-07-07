import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { User } from '../user/entities/user.entity';
import { BoardUglyResolver } from './boardUgly.resolver';
import { BoardUglyService } from './boardUgly.service';
import { BoardUgly } from './entities/boardUgly.entity';

@Module({
  // imports: [],
  // controllers: [],
  imports: [
    TypeOrmModule.forFeature([BoardUgly, ProductUgly, User])
  ],
  providers: [BoardUglyResolver, BoardUglyService],
})
export class BoardUglyModule {}
