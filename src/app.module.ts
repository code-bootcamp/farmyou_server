import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { CategoryModule } from './apis/category/category.module';
import { DirectStoreModule } from './apis/directStore/directStore.module';
import { ImageDirectProductModule } from './apis/imageDirectProduct/imageDirectProduct.module';
import { ImageUglyProductModule } from './apis/imageUglyProduct/imageUglyProduct.module';
import { ImageUserModule } from './apis/imageUser/imageUser.module';
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

@Module({
  imports: [
    AdminModule,
    SellerModule,
    AuthModule,
    CategoryModule,
    DirectStoreModule,
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
      host: '172.30.192.8', //인스턴스 sql 비공개ip주소
      // host: 'localhost',                  //내부에서 테스트로 돌려볼 호스트 주소
      port: 3306,
      username: 'root',
      // password: '12345678',
      password: 'root',
      database: 'farmyou_server', //인스턴스 sql ID값
      // database:               // 내부에서 테스트로 돌려볼 데이터 베이스 이름
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,
    //   url: 'redis://my-redis:6379',
    //   isGlobal: true,
    // }),
  ],
  controllers: [AppController],
})
export class AppModule {}
