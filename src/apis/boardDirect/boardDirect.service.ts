import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardDirect } from './entities/boardDirect.entity';
import { getRepository, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';


@Injectable()
export class BoardDirectService {
  constructor (
    @InjectRepository(BoardDirect)
    private readonly boardDirectRepository: Repository<BoardDirect>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UserService
  ) {}

  async findAll() {
    return await this.boardDirectRepository.find();
  }

  async findOne({ title }) {
    return await this.boardDirectRepository.findOne({ where: { title: title } });
  }  

  async create(title, content, productDirectId, userId) {
    const post = await this.boardDirectRepository.findOne({
      productDirect: {id: productDirectId}
    });

    if (!post) {
      const result = await this.boardDirectRepository.save({
        title,
        content,
        productDirect: {id: productDirectId},
        writer: {id: userId}
      })

      // user 측에도 이 게시글 등록
      // const userTheWriter = this.userRepository.findOne({id: userId});
      const boardDirectNum = await result.number;
      
      await this.userService.postBoardDirect({userId, boardDirectNum});

      return result.title;
    }
    // 1. 데이터를 등록하는 로직 => DB에 접속해서 데이터 저장하기
    // const result = await this.boardDirectRepository.save({
    //   title,
    //   content,
    //   productDirect: {id: productDirectId},
    //   writer: {id: userId}
    // })

    // 2. 저장 결과 응답 주기
    // return '게시물 등록에 성공하였습니다!!';
    return "해당 상품의 게시글이 이미 존재합니다";
  }

  async findBoardsByDateAsc({searchedTitle, page}) {
    // const result = await this.boardDirectRepository
    // .createQueryBuilder('board')
    // .where(`board.title: ${searchedTitle}`)
    // .orderBy('board.createdAt', 'ASC')
    // .getMany();
    // // .limit(10);

    // console.log(result);

    // return result;
    const result = await getRepository(BoardDirect)
    .createQueryBuilder('b')
    // .where(`b.title.length > :1`)
    .orderBy('b.createdAt', 'ASC')
    .take(1)
    .getMany();

    console.log(result);

    return result;
  }
}
