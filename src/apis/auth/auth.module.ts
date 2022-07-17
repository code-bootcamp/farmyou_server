import { CacheModule, Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
// import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { AddressUserService } from '../addressUser/addressUser.service';
import { SellerService } from '../seller/seller.service';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/entities/admin.entity';
import { Seller } from '../seller/entities/seller.entity';
import { DirectStore } from '../directStore/entities/directStore.entity';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';
import { FileResolver } from '../file/file.resolver';
import { FileService } from '../file/file.service';
import { File } from '../file/entities/file.entity';

@Module({
    imports: [
        CacheModule.register(),
        JwtModule.register({}), //
        TypeOrmModule.forFeature([
            User,
            AddressUser,
            Seller,
            Admin,
            DirectStore,
            ProductDirect,
            ProductUgly,
            File
        ]),
    ],
    providers: [
        JwtRefreshStrategy,
        JwtGoogleStrategy,
        JwtNaverStrategy,
        // JwtKakaoStrategy,
        AuthResolver, //
        AuthService,
        UserService,
        AddressUserService,
        SellerService,
        AdminService,
        FileResolver,
        FileService,
        Object,
    ],
    controllers: [
        AuthController, //
    ],
})
export class AuthModule {}
