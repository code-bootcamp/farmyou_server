import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { FileUpload } from 'graphql-upload';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Seller } from '../seller/entities/seller.entity';
import { ProductDirect } from '../productDirect/entities/productDirect.entity';
import { ProductUgly } from '../productUgly/entities/productUgly.entity';

interface IFile {
    files: FileUpload[];
}

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async upload({ files }: IFile) {
        const storage = new Storage({
            projectId: process.env.GCP_KEYFILENAME,
            keyFilename: process.env.GCP_PROJECTID,
        }).bucket(process.env.GCP_BUKET);

        // 프론트엔드에서 파일을 다 받을 때까지 대기!
        const waitedFiles = await Promise.all(files);

        const resultUrl = await Promise.all(
            waitedFiles.map((el) => {
                return new Promise((resolve, reject) => {
                    el.createReadStream()
                        .pipe(storage.file(el.filename).createWriteStream())
                        .on('finish', () => resolve(`${process.env.GCP_BUKET}/${el.filename}`))
                        .on('error', (error) => reject(error));
                });
            }),
        );

        await this.fileRepository.save({
            url: `${resultUrl}`,
        });

        console.log(resultUrl);
        return resultUrl;
    }

    async find({ fileId }) {
        return await this.fileRepository.findOne({
            relations: [
                'productUgly',
                'productDirect',
                'user',
                'seller',
                'admin',
            ],
            where: { id: fileId },
        });
    }

    async findAll() {
        return await this.fileRepository.find({
            relations: [
                'productUgly',
                'productDirect',
                'user',
                'seller',
                'admin',
            ],
        });
    }

    async findAllProductUgly({productUglyId}) {
        return await this.fileRepository.find({
            relations: [
                'productUgly',
                'productDirect',
                'user',
                'seller',
                'admin',
            ],
            where: {productUgly: {id: productUglyId}}
        });
    }
}
