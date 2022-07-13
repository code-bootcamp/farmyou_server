import { ConflictException, HttpException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UpdateAdminInput } from './dto/updateAdmin.input';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcrypt';
import { DirectStore } from '../directStore/entities/directStore.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(DirectStore)
    private readonly directStoreRepository: Repository<DirectStore>,
  ) {}

  async findOne({ directStoreId }) {
    return await this.adminRepository.findOne({ directStore: {id:  directStoreId} });
  }

  // async findAll() {
  //   return await this.adminRepository.find();
  // }

  async create({ email, hashedPassword: password, directStoreId }) {
    const admin = await this.adminRepository.findOne({ email });
    if (admin) throw new ConflictException('이미 등록된 이메일 입니다.');

    const thisAdmin = await this.adminRepository.save({
      email,
      password,
      directStore: {id: directStoreId}
    });

    const store = await this.directStoreRepository.findOne({id: directStoreId});

    store.admin = thisAdmin;

    // return await this.adminRepository.save({ email, password, name, phone });
    return thisAdmin;
  }

  // async update({currentUser, email, password, phone, newAddress}) {
  //   // addressAdmin 변경하는 것도 넣어야 함
  //   // const farmAdmin = await this.adminRepository.findOne({where: {email: updateAdminInput.email}});

  //   // if (farmAdmin) {
  //   //   const newAdmin = {
  //   //     ...farmAdmin,
  //   //     // email: email,
  //   //     // password: hashedPassword,
  //   //     // ...updateAdminInput,
  //   //   }
  //   //   return await this.adminRepository.save(newAdmin);
  //   // } else {
  //   //   throw new UnprocessableEntityException('유저가 존재하지 않습니다!!');
  //   // }

  //   // const admin = await this.adminRepository.findOne({
  //   //   email: currentUser.email,
  //   // });

  //   const loggedAdmin = await this.adminRepository.findOne({id: currentUser.id});

  //   if (email) {
  //     loggedAdmin.email = email;
  //   }

  //   if (password) {
  //     loggedAdmin.password = await bcrypt.hash(password, 10);
  //   }

  //   if (phone) {
  //     loggedAdmin.phone = phone;
  //   }

  //   if (newAddress) {
  //     const loggedAdminAddress = await this.addressAdminRepository.findOne({admin: {id: loggedAdmin.id}});
  //     console.log(loggedAdminAddress);
  //     if (newAddress.isMain) {
  //       loggedAdminAddress.isMain = newAddress.isMain;
  //     }
  //     if (newAddress.address) {
  //       loggedAdminAddress.address = newAddress.address;
  //     }
  //     if (newAddress.detailedAddress) {
  //       loggedAdminAddress.detailedAddress = newAddress.detailedAddress;
  //     }
  //     if (newAddress.postalCode) {
  //       loggedAdminAddress.postalCode = newAddress.postalCode;
  //     }
  //     this.addressAdminRepository.save(loggedAdminAddress);
  //   }

  //   return this.adminRepository.save(loggedAdmin);
  // }

  async findLoggedIn({ currentUser }) {
    return await this.adminRepository.findOne({
      where: {
        adminId: currentUser.adminId,
      },
    });
  }

  // async postBoardDirect({adminId, boardDirectNum}) {
  //   return this.adminRepository.save({
  //     id: adminId, 
  //     boardDirectNum
  //   });
  // }
}
