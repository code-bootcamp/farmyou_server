import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressUser } from './entities/addressUser.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AddressUserService {
  constructor (
    @InjectRepository(AddressUser)
    private readonly addressUserRepository: Repository<AddressUser>,
  ) {}

  async findAll() {
    return await this.addressUserRepository.find();
  }

  async findOne({ addressId }) {
    return await this.addressUserRepository.findOne({ where: { id: addressId } });
  }  

  async create(address, detailedAddress, postalCode, userId, isMain) {
    // 1. 데이터를 등록하는 로직 => DB에 접속해서 데이터 저장하기
    const result = await this.addressUserRepository.save({
      address,
      detailedAddress,
      postalCode,
      user: {id: userId},
      isMain: isMain
    })

    // 2. 저장 결과 응답 주기
    // return '게시물 등록에 성공하였습니다!!';
    return result;
  }

  async delete({ id }) {
    const result = await this.addressUserRepository.delete({ id: id });
    return result.affected ? true : false;
  }

  async update({ addressId, updateAddressUserInput }) {
    const theaddress = await this.addressUserRepository.findOne({
      where: { id: addressId },
    });

    const newAddress = {
      ...theaddress,
      id: addressId,
      ...updateAddressUserInput,
    };

    return await this.addressUserRepository.save(newAddress);
  }
}
