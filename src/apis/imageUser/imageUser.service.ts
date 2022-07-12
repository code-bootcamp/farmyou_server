import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { User } from '../user/entities/user.entity';
import { ImageUser } from './entities/imageUser.entity';

@Injectable()
export class ImageUserService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ImageUser)
    private readonly imageUserRepository: Repository<ImageUser>,
  ) {}

  // async upload({ user_type, user_id, files }) {
  async upload({ files }) {
    // if (user_type === "Seller" || user_type === "판매자") {
    //   // 유저타입이 판매자일 경우 seller 값에 id 저장
    //   await this.imageUserRepository.save({
    //     seller: user_id
    //   });
    //   // 유저타입이 구매자일 경우 user 값에 id 저장
    // } else {
    //   await this.imageUserRepository.save({
    //     user: user_id
    //   });
    // }
    // 일단 먼저 다 받기
    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles); // [file, file]

    const storage = new Storage({
      projectId: 'codecamp-355721',
      keyFilename: 'gcp-file-storage.json',
    }).bucket('pukkukim');

    const results = await Promise.all(
      waitedFiles.map((el) => {
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(el.filename).createWriteStream())
            .on('finish', () => resolve(`pukkukim/${el.filename}`))
            .on('error', () => reject());
        });
      }),
    ); // await Promise.all([Promise, Promise])
    // const results = ["폴더명/파일명", "폴더명/파일명"]

    console.log(results);
    // not working
    // await this.imageUserRepository.save({url: results});

    return results;
  }

  // not sure if it'll work
  async saveImage({user_type, user_id, urls}) {
    urls.array.forEach(async element => {
      if (user_type === "Seller" || user_type === "판매자") {
        // 유저타입이 판매자일 경우 seller 값에 id 저장
        await this.imageUserRepository.save({
          seller: user_id
        });
        // 유저타입이 구매자일 경우 user 값에 id 저장
      } else {
        await this.imageUserRepository.save({
          user: user_id
        });
      }
      this.imageUserRepository.save({
        url: element
      })
    });
  }
}
