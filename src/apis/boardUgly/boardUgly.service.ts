import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardUgly } from './entities/boardUgly.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardUglyService {
  constructor(
    @InjectRepository(BoardUgly)
    private readonly boardUglyRepository: Repository<BoardUgly>,
  ) {}

  async findAll() {
    return await this.boardUglyRepository.find();
  }

  async findOne({ title }) {
    return await this.boardUglyRepository.findOne({ where: { title: title } });
  }  

  async create(title, content, productUglyId, userId) {
    // 1. 데이터를 등록하는 로직 => DB에 접속해서 데이터 저장하기
    const result = await this.boardUglyRepository.save({
      title,
      content,
      productUgly: {id: productUglyId},
      writer: {id: userId}
    })

    // 2. 저장 결과 응답 주기
    // return '게시물 등록에 성공하였습니다!!';
    return result;
  }
}
