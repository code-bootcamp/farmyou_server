import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { BoardDirectModule } from './apis/boardDirect/boardDirect.module';
import { BoardUglyModule } from './apis/boardUgly/boardUgly.module';
import { ImageDirectProductModule } from './apis/imageDirectProduct/imageDirectProduct.module';
import { ImageUglyProductModule } from './apis/imageUglyProduct/imageUglyProduct.module';
import { ImageUserModule } from './apis/imageUser/imageUser.module';
import { InquiryModule } from './apis/inquiry/inquiry.module';
import { PaymentMoudle } from './apis/payment/payment.module';
import { ProductDirectModule } from './apis/productDirect/productDirect.module';
import { ProductUglyModule } from './apis/productUgly/productUgly.module';
import { UserModule } from './apis/user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    BoardDirectModule,
    BoardUglyModule,
    ImageDirectProductModule,
    ImageUglyProductModule,
    ImageUserModule,
    InquiryModule,
    PaymentMoudle,
    ProductDirectModule,
    ProductUglyModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({req, res}) => ({req, res}),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: '172.30.192.8', //인스턴스 sql 비공개ip주소
      host: 'localhost',                  //내부에서 테스트로 돌려볼 호스트 주소
      port: 3306,
      username: 'root',
      password: '12345678',
      database: 'farmyou_server', //인스턴스 sql ID값
      // database:               // 내부에서 테스트로 돌려볼 데이터 베이스 이름
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModuleTest {}
