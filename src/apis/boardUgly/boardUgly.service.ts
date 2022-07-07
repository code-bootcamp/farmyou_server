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

  findAll() {
    // 1. 데이터를 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
    const result = [
    //   {
    //     number: 1,
    //     writer: '철수',
    //     title: '제목입니다~~',
    //     contents: '내용이에요@@@',
    //   },
    //   {
    //     number: 2,
    //     writer: '영희',
    //     title: '영희 제목입니다~~',
    //     contents: '영희 내용이에요@@@',
    //   },
    //   {
    //     number: 3,
    //     writer: '훈이',
    //     title: '훈이 제목입니다~~',
    //     contents: '훈이 내용이에요@@@',
    //   },
    ];

    // 2. 꺼내온 결과 응답 주기
    return result;
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
