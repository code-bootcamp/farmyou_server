// import coolsms from 'coolsms-node-sdk';
const coolsms = require('coolsms-node-sdk').default;
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class PhoneService {
    checkValidationPhone(myphone) {
        console.log(myphone)
        if (myphone.phoneNum.length !== 10 && myphone.phoneNum.length !== 11) {
            console.log('에러 발생!!! 핸드폰 번호를 제대로 입력해 주세요!!!');
            return false;
        } else {
            return true;
        }
    }

    getToken() {
        const mycount = 6;
        const result = String(
            Math.floor(Math.random() * 10 ** mycount),
        ).padStart(mycount, '0');
        return result;
    }

    async sendTokenToSMS(receiver, token) {
        console.log(process.env.SMS_SENDER)
        const SMS_KEY = process.env.SMS_KEY;
        const SMS_SECRET = process.env.SMS_SECRET;
        const SMS_SENDER = process.env.SMS_SENDER;

        const mysms = coolsms;
        const messageService = new mysms(SMS_KEY, SMS_SECRET);
        const result = await messageService.sendOne({
            to: receiver,
            from: SMS_SENDER,
            text: `안녕하세요?! 요청하신 인증번호는 [${token}] 입니다.`,
        });

        console.log(result);
    }

    // // 승원제작
    // async sendToToken({phone}){

    // }
}
