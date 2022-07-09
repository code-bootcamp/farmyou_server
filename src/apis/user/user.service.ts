import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async create({ email, hashedPassword: password, name, phone }) {
    const user = await this.userRepository.findOne({ email });
    if (user) throw new ConflictException('이미 등록된 이메일 입니다.');

    return await this.userRepository.save({ email, password, name, phone });
  }

  async update({email, updateUserInput, hashedPassword}) {
    const farmUser = await this.userRepository.findOne({where: {email: email}})
    if (email) {
      const newUser = {
        ...farmUser,
        email: email,
        password: hashedPassword,
        ...updateUserInput,
      }
      return await this.userRepository.save(newUser);
    }
   // 왜 추가로 생성 되는지 물어보기 
  }

}
