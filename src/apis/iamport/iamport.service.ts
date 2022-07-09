import { Injectable } from "@nestjs/common";
import axios from 'axios';
import 'dotenv/config';

@Injectable()
export class IamportService {
    async getToken() {
        return await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IAMPORT_REST_API_KEY,
                imp_secret: process.env.IAMPORT_REST_API_SECRET
            }
        });
    }

    async valid({impUid, access_token}) {
        // imp_uid로 아임포트 서버에서 결제 정보 조회
        console.log("아무거나1111");
        await axios({
            url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
            method: "get", // GET method
            headers: {
                "Authorization": access_token // 발행된 액세스 토큰
            }
        });
        console.log("아무거나2222");
    }

    async requestRefund({impUid, access_token}) {
        await axios({
            url: "https://api.iamport.kr/payments/cancel",
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
            },
            data: {
                imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
            }
        });
    }
}