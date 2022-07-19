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

        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,

        // @InjectRepository(Seller)
        // private readonly sellerRepository: Repository<Seller>,

        // @InjectRepository(ProductDirect)
        // private readonly productDirect: Repository<ProductDirect>,

        // @InjectRepository(ProductUgly)
        // private readonly productUgly: Repository<ProductUgly>,
    ) {}

    async upload({ files }: IFile) {
        const storage = new Storage({
            projectId: 'codecamp-355721',
            keyFilename: 'gcp-file-storage.json',
        }).bucket('pukkukim');

        // 프론트엔드에서 파일을 다 받을 때까지 대기!
        const waitedFiles = await Promise.all(files);

        const resultUrl = await Promise.all(
            waitedFiles.map((el) => {
                return new Promise((resolve, reject) => {
                    el.createReadStream()
                        .pipe(storage.file(el.filename).createWriteStream())
                        .on('finish', () => resolve(`pukkukim/${el.filename}`))
                        .on('error', (error) => reject(error));
                });
            }),
        );

        // console.log(resultUrl);

        await this.fileRepository.save({
            url: `${resultUrl}`,
        });

        return resultUrl;
    }
}
