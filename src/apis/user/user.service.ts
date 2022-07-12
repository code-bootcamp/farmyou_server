import { ConflictException, HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AddressUser } from '../addressUser/entities/addressUser.entity';
import { AddressUserService } from '../addressUser/addressUser.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AddressUser)
    private readonly addressUserRepository: Repository<AddressUser>,

    private readonly addressUserService: AddressUserService
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async create({ email, hashedPassword: password, name, phone, addressUser, isSeller }) {
    const user = await this.userRepository.findOne({ email });
    if (user) throw new ConflictException('이미 등록된 이메일 입니다.');

    const thisUser = await this.userRepository.save({ email, password, name, phone, isSeller });

    console.log(thisUser);

    await this.addressUserService.create(
      addressUser.address,
      addressUser.detailedAddress,
      addressUser.postalCode,
      thisUser.id,
      true
    )

    // return await this.userRepository.save({ email, password, name, phone });
    return thisUser;
  }

  async update({currentUser, email, password, phone, newAddress}) {
    // addressUser 변경하는 것도 넣어야 함
    // const farmUser = await this.userRepository.findOne({where: {email: updateUserInput.email}});

    // if (farmUser) {
    //   const newUser = {
    //     ...farmUser,
    //     // email: email,
    //     // password: hashedPassword,
    //     // ...updateUserInput,
    //   }
    //   return await this.userRepository.save(newUser);
    // } else {
    //   throw new UnprocessableEntityException('유저가 존재하지 않습니다!!');
    // }

    // const user = await this.userRepository.findOne({
    //   email: currentUser.email,
    // });

    const loggedUser = await this.userRepository.findOne({id: currentUser.id});

    if (email) {
      loggedUser.email = email;
    }

    if (password) {
      loggedUser.password = await bcrypt.hash(password, 10);
    }

    if (phone) {
      loggedUser.phone = phone;
    }

    if (newAddress) {
      const loggedUserAddress = await this.addressUserRepository.findOne({user: {id: loggedUser.id}});
      console.log(loggedUserAddress);
      if (newAddress.isMain) {
        loggedUserAddress.isMain = newAddress.isMain;
      }
      if (newAddress.address) {
        loggedUserAddress.address = newAddress.address;
      }
      if (newAddress.detailedAddress) {
        loggedUserAddress.detailedAddress = newAddress.detailedAddress;
      }
      if (newAddress.postalCode) {
        loggedUserAddress.postalCode = newAddress.postalCode;
      }
      this.addressUserRepository.save(loggedUserAddress);
    }

    return this.userRepository.save(loggedUser);
  }

  async findLoggedIn({ currentUser }) {
    return await this.userRepository.findOne({
      where: {
        userId: currentUser.userId,
      },
    });
  }


  async delete({ email }) {
    const result = await this.userRepository.delete({ email });
    return result.affected ? true : false;
  }

  async deleteUser({ currentUser }) {
    const result = await this.userRepository.softDelete({
      id: currentUser.id,
    });
    return result.affected ? true : false;

  // TODO: 회원이 판매자인지 우선 확인작업 필요
  async postBoardDirect({userId, boardDirectNum}) {
    return this.userRepository.save({
      id: userId, 
      boardDirectNum
    });

  }
}
