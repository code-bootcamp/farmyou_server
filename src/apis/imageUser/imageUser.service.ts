import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageUserService {
  async upload({ imageUsers }) {
    // 일단 먼저 다 받기
    const waitedImageUsers = await Promise.all(imageUsers);
    console.log(waitedImageUsers); // [imageUser, imageUser]

    const storage = new Storage({
      projectId: 'codecamp-308601',
      keyImageUsername: 'gcp-imageUser-storage.json',
    }).bucket('codecamp-imageUser-storage');

    const results = await Promise.all(
      waitedImageUsers.map((el) => {
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.imageUser(el.imageUsername).createWriteStream())
            .on('finish', () => resolve(`codecamp-imageUser-storage/${el.imageUsername}`))
            .on('error', () => reject());
        });
      }),
    ); // await Promise.all([Promise, Promise])
    // const results = ["폴더명/파일명", "폴더명/파일명"]

    return results;
  }
}
