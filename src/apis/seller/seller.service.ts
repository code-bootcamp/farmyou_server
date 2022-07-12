import { ConflictException, HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UpdateSellerInput } from './dto/updateSeller.input';
import { Seller } from './entities/seller.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async findOne({ email }) {
    return await this.sellerRepository.findOne({ email });
  }

  async findAll() {
    return await this.sellerRepository.find();
  }

  async create({ email, hashedPassword: password, name, phone }) {
    const seller = await this.sellerRepository.findOne({ email });
    if (seller) throw new ConflictException('이미 등록된 이메일 입니다.');

    const thisSeller = await this.sellerRepository.save({ email, password, name, phone });

    // return await this.sellerRepository.save({ email, password, name, phone });
    return thisSeller;
  }

  async update({currentUser, email, password, phone}) {
    // const farmSeller = await this.sellerRepository.findOne({where: {email: updateSellerInput.email}});

    // if (farmSeller) {
    //   const newSeller = {
    //     ...farmSeller,
    //     // email: email,
    //     // password: hashedPassword,
    //     // ...updateSellerInput,
    //   }
    //   return await this.sellerRepository.save(newSeller);
    // } else {
    //   throw new UnprocessableEntityException('유저가 존재하지 않습니다!!');
    // }

    // const seller = await this.sellerRepository.findOne({
    //   email: currentUser.email,
    // });

    const loggedSeller = await this.sellerRepository.findOne({id: currentUser.id});

    if (email) {
      loggedSeller.email = email;
    }

    if (password) {
      loggedSeller.password = await bcrypt.hash(password, 10);
    }

    if (phone) {
      loggedSeller.phone = phone;
    }

    return this.sellerRepository.save(loggedSeller);
  }

  async findLoggedIn({ currentUser }) {
    return await this.sellerRepository.findOne({
      where: {
        sellerId: currentUser.sellerId,
      },
    });
  }

  // TODO: 회원이 판매자인지 우선 확인작업 필요
  async postBoardDirect({sellerId, boardDirectNum}) {
    return this.sellerRepository.save({
      id: sellerId, 
      boardDirectNum
    });
  }
}
