import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDetailed } from './entities/categoryDetailed.entity';

@Injectable()
export class CategoryDetailedService {
  constructor(
    @InjectRepository(CategoryDetailed)
    private readonly categoryDetailedRepository: Repository<CategoryDetailed>,
  ) {}

  async create({ name, upperCategory }) {
    const result = await this.categoryDetailedRepository.save({ 
        name,
        categorySub: {name: upperCategory}
    });
    console.log(result); // { name: "전자제품" }

    return result;
  }
}
