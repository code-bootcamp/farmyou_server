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

    @Mutation(() => String)
    async sendToken(@Args('phone') phone: string) {
        const phoneNum = phone;

        //휴대폰 자릿수 맞는지 확인하기
        const isValid = this.phoneService.checkValidationPhone({ phoneNum });
        if (isValid) {

            //핸드폰 토큰 6자리 만들기
            const token = this.phoneService.getToken();

            //토큰 레디스에 저장
            const tokenCache = await this.cacheManager.get(`token:${token}`);

            if (tokenCache) {
                return tokenCache;
            }
            await this.cacheManager.set(`token:${token}`, token, { ttl: 180 });

            //핸드폰번호에 토큰 전송하기
           this.phoneService.sendTokenToSMS(phoneNum, token);
        }
    }

    @Mutation(() => String)
    async checkToken(@Args('token') token: string) {
        const tokenCache = await this.cacheManager.get(`token:${token}`);
        if (tokenCache) {
            return true;
        } else {
            throw new UnprocessableEntityException('잘못된 토큰 정보입니다');
        }
    }
}
