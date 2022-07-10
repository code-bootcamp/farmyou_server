import { ConflictException, HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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

  async findAll() {
    return await this.userRepository.find();
  }

  async create({ email, hashedPassword: password, name, phone }) {
    const user = await this.userRepository.findOne({ email });
    if (user) throw new ConflictException('이미 등록된 이메일 입니다.');

    return await this.userRepository.save({ email, password, name, phone });
  }

  async update({updateUserInput, updateAddressUserInput}) {
    // addressUser 변경하는 것도 넣어야 함
    const farmUser = await this.userRepository.findOne({where: {email: updateUserInput.email}});

    if (farmUser) {
      const newUser = {
        ...farmUser,
        // email: email,
        // password: hashedPassword,
        // ...updateUserInput,
      }
      return await this.userRepository.save(newUser);
    } else {
      throw new UnprocessableEntityException('유저가 존재하지 않습니다!!');
    }
   // 왜 추가로 생성 되는지 물어보기 
  }

}
