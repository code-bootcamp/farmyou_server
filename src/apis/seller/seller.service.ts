import { ConflictException, HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Seller } from './entities/seller.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async findOne({ email }) {
    return await this.sellerRepository.findOne({ relations: ['users'], where: {email: email} });
  }

  async findAll() {
    return await this.sellerRepository.find({
        relations: ['users']
    });
  }

  async create({ email, hashedPassword: password, name, phone }) {
    const seller = await this.sellerRepository.findOne({ email });
    if (seller) throw new ConflictException('이미 등록된 이메일 입니다.');

    const thisSeller = await this.sellerRepository.save({
      email, 
      password, 
      name, 
      phone,
      like: 0,
      users: []
     });

    // return await this.sellerRepository.save({ email, password, name, phone });
    return thisSeller;
  }

  async update({currentUser, email, password, phone}) {
    const loggedSeller = await this.sellerRepository.findOne({id: currentUser.id});

    if (email) {
      loggedSeller.email = email;
    }

    if (password) {
      loggedSeller.password = await bcrypt.hash(password, 10.2);
    }

    if (phone) {
      loggedSeller.phone = phone;
    }

    return this.sellerRepository.save(loggedSeller);
  }

  async postBoardDirect({sellerId, boardDirectNum}) {
    return this.sellerRepository.save({
      id: sellerId, 
      boardDirectNum
    });
  }
}
