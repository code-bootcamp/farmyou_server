import coolsms from "coolsms-node-sdk"
import 'dotenv/config'

// export function checkValidationPhone(myphone){
//     if(myphone.length !== 10 && myphone.length !== 11){
//         console.log("에러 발생!!! 핸드폰 번호를 제대로 입력해 주세요!!!")
//         return false
//     } else {
//         return true
//     }
// }

export function getToken(){
    const mycount = 6;
    const result = String(Math.floor(Math.random() * 10**mycount)).padStart(mycount, "0")
    return result;
}

export async function sendTokenToSMS(fff, ggg){
    const SMS_KEY = process.env.SMS_KEY
    const SMS_SECRET = process.env.SMS_SECRET
    const SMS_SENDER = process.env.SMS_SENDER

    const mysms = coolsms.default
    const messageService = new mysms(SMS_KEY, SMS_SECRET)
    const result = await messageService.sendOne({ 
        to: fff, 
        from: SMS_SENDER, 
        text: `안녕하세요?! 요청하신 인증번호는 [${ggg}] 입니다.` 
    })

    console.log(result);
}