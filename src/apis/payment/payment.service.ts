import {
    Injectable,
    ConflictException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';
import { IamportService } from '../iamport/iamport.service';

@Injectable()
export class PaymentService {
    //7월 16일 결제 다시 만들기
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly connection: Connection,
    ) {}

    async create({ impUid, amount, currentUser }) {
        const thisUser = await this.userRepository.findOne({
            relations: ['sellers', 'directProducts'],
            where: {id: currentUser.id}
          });
        // 1. 거래기록 1줄 생성 해야함
        const payment = this.paymentRepository.create({
            impUid: impUid,
            amount: amount,
            user: thisUser,
            paymentComplete: PAYMENT_STATUS_ENUM.PAYMENT,
        });
        console.log(payment);
        await this.paymentRepository.save(payment);

        // 2. 유저의 돈 찾아오기
        // const user = await this.userRepository.findOne({ id: currentUser.id });

        //========================================================
        // 3. 유저의 돈(포인트) 업데이트
        // 하지만 우리 프로젝트 내에선 유저가 돈이나 포인트를 모아두는 것이 없음
        // 그러므로 유저의 돈은 업데이트 할 필요가 없음
        // await this.userRepository.update(
        //   {id: user.id},
        //   {}
        // )
        //========================================================

        // 4. 프론트엔드에 최종결과 돌려주기
        return payment;
    }
<<<<<<< HEAD
}
=======
  }
>>>>>>> 844d584b0a886432b91511527a3b7f3ebabb2396
