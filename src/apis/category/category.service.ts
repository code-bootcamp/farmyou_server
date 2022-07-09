import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne({ name }) {
    return await this.categoryRepository.findOne({ where: { name: name } });
  }  

  async create({ name }) {
    const result = await this.categoryRepository.save({ name });
    console.log(result); // { name: "전자제품" }

    return result;
  }
}
