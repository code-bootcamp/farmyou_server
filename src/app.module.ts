import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { BoardModule } from './apis/board/board.module';
import * as redisStore from 'cache-manager-redis-store'
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    BoardModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({req, res}) => ({req, res}),
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://172.30.193.3:6379',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.30.192.5', //인스턴스 sql 비공개ip주소
      // host:                   //내부에서 테스트로 돌려볼 호스트 주소
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'backend', //인스턴스 sql ID값
      // database:               // 내부에서 테스트로 돌려볼 데이터 베이스 이름
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
  }),

  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
