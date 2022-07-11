import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InquiryService {
    constructor(
      @InjectRepository(Inquiry)
      private readonly inquiryRepository: Repository<Inquiry>,
    ) {}

  async findAll() {
    return await this.inquiryRepository.find();
  }

  async findOne({ title }) {
    return await this.inquiryRepository.findOne({ where: { title: title } });
  }  

  async create(title, content, userId, productDirectId, productUglyId) {
    // 1. 데이터를 등록하는 로직 => DB에 접속해서 데이터 저장하기
    const result = await this.inquiryRepository.save({
      title,
      content,
      user: {id: userId},
      productDirect: {id: productDirectId},
      productUgly: {id: productUglyId}
    })

    // 2. 저장 결과 응답 주기
    // return '게시물 등록에 성공하였습니다!!';
    return result;
  }
}
