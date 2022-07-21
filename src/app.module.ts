import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { CategoryModule } from './apis/category/category.module';
import { DirectStoreModule } from './apis/directStore/directStore.module';
import { InquiryModule } from './apis/inquiry/inquiry.module';
import { PaymentMoudle } from './apis/payment/payment.module';
import { ProductDirectModule } from './apis/productDirect/productDirect.module';
import { ProductUglyModule } from './apis/productUgly/productUgly.module';
import { UserModule } from './apis/user/user.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { Seller } from './apis/seller/entities/seller.entity';
import { SellerModule } from './apis/seller/seller.module';
import { AdminModule } from './apis/admin/admin.module';
import { FileModule } from './apis/file/file.module';
import { AddressUserModule } from './apis/addressUser/addressUser.module';
import { PhoneModule } from './apis/phone/phone.module';



@Module({
  imports: [
    AddressUserModule,
    AdminModule,
    FileModule,
    SellerModule,
    AuthModule,
    CategoryModule,
    DirectStoreModule,
    InquiryModule,
    PaymentMoudle,
    PhoneModule,
    ProductDirectModule,
    ProductUglyModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({req, res}) => ({req, res}),
      cors: {
        origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
        credentials: true,
      },
      // cors: {
      //   origin:[
      //   'http://localhost:3000', 
      //   'http://127.0.0.1:5500/frontTest/login/index.html',
      // ],
      //   credentials: true,
      // },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.36.80.11', // 새로 배포하는 주소 인스턴스 sql 비공개ip주소
      // host: 'localhost',  // 내부에서 테스트로 돌려볼 호스트 주소
      // host: 'my-database',
      port: 3306,
      username: 'root',
      // password: '12345678',   //yarn start:dev  할때 사용
      password: 'root',         //docker 나 배포 할때 사용
      database: 'farmyou_server', //인스턴스 sql ID값  배포나 yarn start:dev
      // database: 'farmyou_docker', //도커로 띄울때
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      // url: 'redis://10.36.81.3:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
// 
