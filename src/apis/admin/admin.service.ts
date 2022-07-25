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
import { File, IMAGE_TYPE_ENUM } from '../file/entities/file.entity';
import { FileResolver } from '../file/file.resolver';

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
            relations: ['directStore'],
            where: {directStore: { id: directStoreId }},
        });
    }

    async findOneByEmail({ email }) {
        return await this.adminRepository.findOne({ email });
    }

    async create({
        email,
        hashedPassword: password,
        directStoreId,
    }) {
        try {
            const theStore = await this.directStoreRepository.findOne({
                id: directStoreId,
            });

            const thisAdmin = await this.adminRepository.save({
                email,
                password,
                directStore: theStore,
            });

            await this.directStoreRepository.save({
                id: theStore.id,
                name: theStore.name,
                admin: thisAdmin,
            });
            return thisAdmin;
        } catch (err) {
            throw new ConflictException(
                '해당 직매장에 관리자를 배치할 수 없습니다.',
            );
        }
    }

    async update({
        password,
        currentUser
    }) {
        const loggedAdmin = await this.adminRepository.findOne({
            relations: ['directStore', 'files'],
            where: {id: currentUser.id},
        });

        if (password) {
            loggedAdmin.password = await bcrypt.hash(password, 10.2);
        }

        return await this.adminRepository.save(loggedAdmin);
    }

    async findAll() {
        return await this.adminRepository.find({
            relations: ['directStore'],
        });
    }
}
