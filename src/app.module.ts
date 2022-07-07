import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({req, res}) => ({req, res}),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.30.192.8', //인스턴스 sql 비공개ip주소
      // host:                   //내부에서 테스트로 돌려볼 호스트 주소
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'farmyou_server', //인스턴스 sql ID값
      // database:               // 내부에서 테스트로 돌려볼 데이터 베이스 이름
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
