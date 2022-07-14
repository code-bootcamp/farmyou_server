import {
    ConflictException,
    HttpException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
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
        return await this.adminRepository.findOne({
            directStore: { id: directStoreId },
        });
    }

    async findOneByEmail({ email }) {
        return await this.adminRepository.findOne({ email });
    }

    async create({
        email,
        hashedPassword: password,
        directStoreId,
        isWebMaster,
    }) {
        if (isWebMaster === true) {
            const webmaster = await this.adminRepository.findOne({
                isWebMaster: true,
            });
            console.log(webmaster);
            if (!webmaster) {
                const newWebMaster = await this.adminRepository.save({
                    email,
                    password,
                    isWebMaster,
                });
                return newWebMaster;
            } else {
                throw new ConflictException('웹마스터 계정이 이미 존재합니다.');
            }
        }

        try {
            const theStore = await this.directStoreRepository.findOne({
                id: directStoreId,
            });

            const thisAdmin = await this.adminRepository.save({
                email,
                password,
                directStore: theStore,
                isWebMaster,
            });

            await this.directStoreRepository.save({
                id: theStore.id,
                name: theStore.name,
                admin: thisAdmin,
            });

            // return await this.adminRepository.save({ email, password, name, phone });
            return thisAdmin;
        } catch (err) {
            throw new ConflictException(
                '해당 직매장에 관리자를 배치할 수 없습니다.',
            );
        }
    }

    async findLoggedIn({ currentUser }) {
        return await this.adminRepository.findOne({
            where: {
                id: currentUser.id,
            },
        });
    }
}
