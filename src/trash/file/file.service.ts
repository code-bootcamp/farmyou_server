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
// //file.service.ts


// import { Injectable } from '@nestjs/common';
// import { FileUpload } from 'graphql-upload';
// import { Storage } from '@google-cloud/storage';

// interface IUpload {
//   files: FileUpload[];
// }

// @Injectable()
// export class FileService {
//   async upload({ files }: IUpload) {
//     const storage = new Storage({
//       keyFilename: process.env.STORAGE_KEY_FILENAME,
//       projectId: process.env.STORAGE_PROJECT_ID,
//     }).bucket(process.env.STORAGE_BUCKET);

//     const waitedFiles = await Promise.all(files);
//     const urls = await Promise.all(
//       waitedFiles.map(
//         (file) =>
//           new Promise((resolve, reject) => {
//             file
//               .createReadStream()
//               .pipe(storage.file(file.filename).createWriteStream())
//               .on('finish', () =>
//                 resolve(`${process.env.STORAGE_BUCKET}/${file.filename}`),
//               )
//               .on('error', (error) => reject(error));
//           }),
//       ),
//     );
//     return urls;
//   }
// }


//file.service.ts


// import { Injectable } from '@nestjs/common';
// import { FileUpload } from 'graphql-upload';
// import { Storage } from '@google-cloud/storage';

// interface IUpload {
//   file: FileUpload;
// }

// @Injectable()
// export class FileService {
//   async upload({ file }: IUpload) {
//     const storage = new Storage({
//       keyFilename: process.env.STORAGE_KEY_FILENAME,
//       projectId: process.env.STORAGE_PROJECT_ID,
//     }).bucket(process.env.STORAGE_BUCKET);

//     const url = await new Promise((resolve, reject) => {
//       file
//         .createReadStream()
//         .pipe(storage.file(file.filename).createWriteStream())
//         .on('finish', () => resolve(`${process.env.STORAGE_BUCKET}/${file.filename}`))
//         .on('error', (error) => reject(error));
//     });
//     return url;
//   }
// }