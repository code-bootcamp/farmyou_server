import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  async upload({ files }) {
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

    return results;
  }
}
