import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectStore } from './entities/directStore.entity';

@Injectable()
export class DirectStoreService {
  constructor(
    @InjectRepository(DirectStore)
    private readonly directStoreRepository: Repository<DirectStore>,
  ) {}

  async findAll() {
    return await this.directStoreRepository.find({
      relations: ['admin']
    });
  }

  async findOne({ name }) {
    return await this.directStoreRepository.findOne({ where: { name: name } });
  }  

  async create({ name }) {
    const result = await this.directStoreRepository.save({ name });

    return result;
  }
}
