import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AddressUserResolver } from './addressUser.resolver';
import { AddressUserService } from './addressUser.service';
import { AddressUser } from './entities/addressUser.entity';

@Module({
    // imports: [],
    // controllers: [],
    imports: [TypeOrmModule.forFeature([AddressUser, User])],
    providers: [AddressUserResolver, AddressUserService],
})
export class AddressUserModule {}
