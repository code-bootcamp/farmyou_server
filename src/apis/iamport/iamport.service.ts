import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import axios from 'axios';
import 'dotenv/config';

// 지영누나 파일
// @Injectable()
// export class IamportService {
//     async getToken() {
//         return await axios({
//             url: "https://api.iamport.kr/users/getToken",
//             method: "post", // POST method
//             headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
//             data: {
//                 imp_key: process.env.IAMPORT_REST_API_KEY,
//                 imp_secret: process.env.IAMPORT_REST_API_SECRET
//             }
//         });
//     }

//     async valid({impUid, access_token}) {
//         // imp_uid로 아임포트 서버에서 결제 정보 조회
//         console.log("아무거나1111");
//         await axios({
//             url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
//             method: "get", // GET method
//             headers: {
//                 "Authorization": access_token // 발행된 액세스 토큰
//             }
//         });
//         console.log("아무거나2222");
//     }

//     async requestRefund({impUid, access_token}) {
//         await axios({
//             url: "https://api.iamport.kr/payments/cancel",
//             method: "post",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
//             },
//             data: {
//                 imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
//             }
//         });
//     }
// }


// 7월 15일 승원 파일 생성
@Injectable()
export class IamportService {
  // 토큰 가져오기
  async getToken({ impUid }) {
    const IM_ID = process.env.IMP_KEY;
    const IM_SC = process.env.IMP_SECRET;
    const data = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: IM_ID, // REST API키
        imp_secret: IM_SC, // REST API Secret
      },
    });
    const { access_token } = data.data.response;

    // imp_uid로 아임포트 서버에서 결제 정보 조회
    try {
      const getPaymentData = await axios({
        url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      });

      const paymentData = getPaymentData.data.response; // 조회한 결제 정보
      return paymentData;
    } catch {
      throw new UnprocessableEntityException('실제로 결제를 부탁드립니다.');
    }
  }

  async getCancelData(impUid) {
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
      data: {
        imp_key: '3766414944032641', // REST API 키
        imp_secret:
          'fe425c5ef827b9e073098d6b679470f74cf279c044be6b39b106538f6b09272494d4549d81d3803a', // REST API Secret
      },
    });

    const { access_token } = getToken.data.response;
    await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
      },
      data: {
        imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
      },
    });

  }
}