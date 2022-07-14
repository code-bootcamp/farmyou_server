import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageUglyProduct } from './entities/imageUglyProduct.entity';

@Injectable()
export class ImageUglyProductService {
  constructor(
    @InjectRepository(ImageUglyProduct)
    private readonly imageUglyProductRepository: Repository<ImageUglyProduct>
  ){}
  async upload({ files }) {
    // 일단 먼저 다 받기
    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles); // [file, file]

    // TODO: 아이디 바꾸기
    // TODO: json 파일 넣기
    const storage = new Storage({
      projectId: 'codecamp-355721',
      keyFilename: 'gcp-file-storage.json',
    }).bucket('pukkukim');

    const results = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          
          el.createReadStream()
            .pipe(storage.file(`productUgly/${el.filename}`).createWriteStream())
            .on('finish', () => resolve(`pukkukim/productUgly/${el.filename}`))
            .on('error', () => reject());
        });
      }),
      
    );
    console.log(results)
    await this.imageUglyProductRepository.save({
      url: `${results}`
    })
    // await Promise.all([Promise, Promise])
    // const results = ["폴더명/파일명", "폴더명/파일명"]

    return results;
  }
}
