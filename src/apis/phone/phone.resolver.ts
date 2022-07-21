import { CACHE_MANAGER, Inject, UnprocessableEntityException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PhoneService } from './phone.service';
import {Cache} from 'cache-manager';

@Resolver()
export class PhoneResolver {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,

        private readonly phoneService: PhoneService,
    ) {}

    // 사용자에게 토큰 전송하기
    @Mutation(() => String)
    async sendToken(@Args('phone') phone: string) {
        //번호확인하기
        const isValid = this.phoneService.checkValidationPhone({ phone });
        if (isValid) {

            //토큰 만들기
            const token = await this.phoneService.getToken();

            //토큰 레디스에 저장
            await this.cacheManager.set(phone, token, { ttl: 180 });

            // 핸드폰번호에 토큰 전송하기
            // 주석처리 풀어야 실제 작동하고 ↓ 
            // 주석 처리 하면 테스트 모드 입니다.
            await this.phoneService.sendTokenToSMS({phone, token});
            return `토큰받았쥬?  토큰 번호는: ${token} 에유`
        }
    }

    // 핸드폰 번호랑 받은 토큰이 맞는지 체크
    @Mutation(() => String)
    async checkToken(
        @Args('phone') phone: string,
        @Args('token') token: string,
    ){
        // return this.phoneService.check({phone, token})
        const checkPhoneToToken = await this.cacheManager.get(phone);
        if(!checkPhoneToToken){
            throw new UnprocessableEntityException('토큰번호 틀렸슈');
        }
        if(checkPhoneToToken === token ){
            return '맞네유 환영해유'
        }
        return new UnprocessableEntityException('잘좀 입력해봐유')
    }
}
