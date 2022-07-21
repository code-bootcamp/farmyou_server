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

        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,

        private readonly fileResolver: FileResolver
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
        // files
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

            // if (files) {
            //     const imageId = await this.fileResolver.uploadFile(files);
            //     const theImage = await this.fileRepository.findOne({
            //         relations: ['productUgly', 'productDirect', 'user', 'seller', 'admin'],
            //         where: {id: imageId}
            //     });
            //     theImage.type = IMAGE_TYPE_ENUM.ADMIN;
            //     theImage.admin = thisAdmin;
    
            //     await this.fileRepository.save(theImage);
            // }

            // return await this.adminRepository.save({ email, password, name, phone });
            return thisAdmin;
        } catch (err) {
            throw new ConflictException(
                '해당 직매장에 관리자를 배치할 수 없습니다.',
            );
        }
    }

    async findAll() {
        return await this.adminRepository.find({
            relations: ['directStore'],
        });
    }
}
