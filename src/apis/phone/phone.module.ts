import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PhoneResolver } from './phone.resolver';
import { PhoneService } from './phone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    PhoneResolver, //
    PhoneService,
  ],
})
export class PhoneModule {}