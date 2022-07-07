import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { User } from '../user/entities/user.entity';
import { BoardDirectResolver } from './boardDirect.resolver';
import { BoardDirectService } from './boardDirect.service';
import { BoardDirect } from './entities/boardDirect.entity';

@Module({
  // imports: [],
  // controllers: [],
  imports: [
    TypeOrmModule.forFeature([BoardDirect, ProductDirect, User])
  ],
  providers: [BoardDirectResolver, BoardDirectService],
})
export class BoardDirectModule {}
