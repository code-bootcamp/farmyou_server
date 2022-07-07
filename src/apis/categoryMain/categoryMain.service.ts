import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryMain } from './entities/categoryMain.entity';

@Injectable()
export class CategoryMainService {
  constructor(
    @InjectRepository(CategoryMain)
    private readonly categoryMainRepository: Repository<CategoryMain>,
  ) {}

  async create({ name }) {
    const result = await this.categoryMainRepository.save({ name });
    console.log(result); // { name: "전자제품" }

    return result;
  }
}
