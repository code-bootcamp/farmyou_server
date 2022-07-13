import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressUserService } from '../addressUser/addressUser.service';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { BoardDirectResolver } from './boardDirect.resolver';
import { BoardDirectService } from './boardDirect.service';
import { BoardDirect } from './entities/boardDirect.entity';

@Module({
  // imports: [],
  // controllers: [],
  imports: [
    TypeOrmModule.forFeature([BoardDirect, ProductDirect, User, AddressUser]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [BoardDirectResolver, BoardDirectService, UserService, AddressUserService],
})
export class BoardDirectModule {}
