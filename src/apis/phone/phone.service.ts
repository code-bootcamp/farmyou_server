import * as coolsms from 'coolsms-node-sdk';
// const coolsms = require('coolsms-node-sdk').default;
import { Injectable } from '@nestjs/common';
import 'dotenv/config';


@Injectable()
export class PhoneService {
    constructor(
    ) {}
    // 핸드폰 번호길이 체크하기
    checkValidationPhone({phone}) {
        console.log(phone)
        if (phone.length !== 10 && phone.length !== 11) {
            console.log('핸드폰번호가 틀렸슈 다시 입력해보세유');
            return false;
        } else {
            return true;
        }
    }

    // 토큰 만들기 
    getToken() {
        const mycount = 6
        if(mycount === undefined){
        console.log("에러 발생!!! 갯수를 제대로 입력해 주세요!!!")
        return
        } else if(mycount <= 0){
        console.log("에러 발생!!! 갯수가 너무 적습니다!!!")
        return
        } else if(mycount > 10) {
        console.log("에러 발생!!! 갯수가 너무 많습니다!!!")
        return
        }
        const result = String(Math.floor(Math.random() * 10**mycount)).padStart(mycount, "0")
        return result
    }

    // 토큰 보내기
    async sendTokenToSMS({phone, token}){
        const SMS_KEY = process.env.SMS_KEY
        const SMS_SECRET = process.env.SMS_SECRET
        const SMS_SENDER = process.env.SMS_SENDER
    
        const mysms = coolsms.default
        const messageService = new mysms(SMS_KEY, SMS_SECRET)
        const result = await messageService.sendOne({
            to: phone,
            from: SMS_SENDER,
            text: `[farmyou] 언제나 신선함이 당신곁에 있어유, 우리는 팜유입니다. 요청하신 인증번호를 보내드립니다. 번호는: [${token}] .`,
            autoTypeDetect: true,
        })
        console.log(result) //await 를 지우면 promis <{pandding}>이 나온다
    }
}
