import { ConflictException, HttpException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import axios from 'axios';
import 'dotenv/config';
import { resourceLimits } from "worker_threads";

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


// 7월 17일 승원 파일 생성
@Injectable()
export class IamportService {
    async getToken() {
        try{
            const result = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: process.env.IAMPORT_REST_API_KEY,
            // imp_key: "123", //에러 테스트용 id
            imp_secret: process.env.IAMPORT_REST_API_SECRET,
            // imp_secret: "123", //에러 테스트용 비밀번호
          })
          return result.data.response.access_token;
          } catch(error){
            // console.log(error)
            throw new HttpException(
            //   import 에서 받아온 에러 메세지를 오류났을때 그대로 보여주기
                error.response.data.message,
                error.response.status,
            )
          }
    }

    async checkPaid({impUid, token, amount}) {
        try{
            const result = await axios.get(
                `https://api.iamport.kr/payments/${impUid}`, 
                {headers: {Authorization: token},}
            )
            if(result.data.response.status !== "paid")
                throw new ConflictException("결제 내역이 존재하지 않습니다.")

            if(result.data.response.amount !== amount)
                throw new ConflictException("결제 금액이 잘못되었습니다.")
        } catch(error) {
            // 만약 에러 메세지가 있거나 없을때 조건
            if(error?.response?.data?.message){
                throw new HttpException(
                    //import 에서 받아온 메세지가 존재할때 메세지를 그대로 보여주기
                    error.response.data.message,
                    error.response.status,
                )
            } else {
                throw error
            }
            
        }
    }

    // import 에서 실제로 결제 취소를 등록하기
    async cancel({impUid, token, requestedAmount}) {
        try{
            // const result = await axios.post('https://api.iamport.kr/payments/cancel', 
            //     {imp_uid: impUid,},
            //     {headers: {Authorization: token}},
            // );
            // return result.data?.response?.cancel_amount; 
            const result = await axios({
                url: "https://api.iamport.kr/payments/cancel",
                method: "post",
                headers: {
                    "Authorization": token
                },
                data: {
                    imp_uid: impUid,
                    amount: requestedAmount
                }
            });
            return result.data?.response?.cancel_amount;
        }catch(error){
            // 만약 에러 메세지가 있거나 없을때 조건
            if(error?.response?.data?.message){
                throw new HttpException(
                    //import 에서 받아온 메세지가 존재할때 메세지를 그대로 보여주기
                    error.response.data.message,
                    error.response.status,
                )
            } else {
                throw error
            }
        }
    }

   
    // async getToken({ impUid }) {
    //     const IM_ID = process.env.IAMPORT_REST_API_KEY;
    //     const IM_SC = process.env.IAMPORT_REST_API_SECRET;
    //     const data = await axios({
    //     url: 'https://api.iamport.kr/users/getToken',
    //     method: 'post', // POST method
    //     headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
    //     data: {
    //         imp_key: IM_ID, // REST API키
    //         imp_secret: IM_SC, // REST API Secret
    //     },
    //     });
    //     const { access_token } = data.data.response;

    //     // imp_uid로 아임포트 서버에서 결제 정보 조회
    //     try {
    //     const getPaymentData = await axios({
    //         url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
    //         method: 'get', // GET method
    //         headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    //     });

    //     const paymentData = getPaymentData.data.response; // 조회한 결제 정보
    //     return paymentData;
    //     } catch {
    //     throw new UnprocessableEntityException('실제로 결제를 부탁드립니다.');
    //     }
    // }




    //================================================================
    // // 7월 15일에 만들었던 파일 
    // async valid({ impUid, access_token }) {
    //     // imp_uid로 아임포트 서버에서 결제 정보 조회
    //     console.log('아무거나1111');
    //     await axios({
    //         url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
    //         method: 'get', // GET method
    //         headers: {
    //             Authorization: access_token, // 발행된 액세스 토큰
    //         },
    //     });
    //     console.log('아무거나2222');
    // }

    // async requestRefund({ impUid, access_token }) {
    //     await axios({
    //         url: 'https://api.iamport.kr/payments/cancel',
    //         method: 'post',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
    //         },
    //         data: {
    //             imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
    //         },
    //     });
    // }
    //================================================================
}