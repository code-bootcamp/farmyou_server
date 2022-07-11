import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageUserService {
  // 지영 누나 설정 파일
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

// 승원 설정 파일
  
// import { Storage } from '@google-cloud/storage';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ImageUserService {
//   async upload({ files }) {
//     ////파일 여러개 올리는 방법
//     //files는 파일이 담겨있는 배열입니다.
//     const waitedFiles = await Promise.all(files);
//     console.log(waitedFiles); //[file, file]

//     // 구글스토리지에 파일 업로드 하기
//     // 파일 하나만 올리는 방법
//     // const myfile = files[0];

//     // 스토리지의 정보

//     const storage = new Storage({
//       projectId: 'f7b3team01server',
//       keyFilename: 'f7b3team01server-d575fc6657f6.json',
//     }).bucket('asia.artifacts.f7b3team01server.appspot.com');

    
//     const result = await Promise.all(
//       waitedFiles.map((el) => {
//         return new Promise((resolve, reject) => {
//           el.createReadStream()
//             .pipe(storage.file(el.filename).createWriteStream())
//             .on('finish', () => resolve(`asia.artifacts.f7b3team01server.appspot.com/${el.filename}`))
//             .on('error', () => reject(null));
//         });
//       }),
//     ); // await Promise.all([Promise, Promise])
//     //const result = ["dangsan/파일명", "dangsan/파일명"]

//     return result.filter(v => v !== null);
//   }
// }
