import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategorySub } from './entities/categorySub.entity';

@Injectable()
export class CategorySubService {
  constructor(
    @InjectRepository(CategorySub)
    private readonly categorySubRepository: Repository<CategorySub>,
  ) {}

  async create({ name, upperCategory }) {
    const result = await this.categorySubRepository.save({ 
        name, 
        categoryMain: {name: upperCategory}
    });
    console.log(result); // { name: "전자제품" }

    return result;
  }
}
