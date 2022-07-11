import { Injectable, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';
import { IamportService } from "../iamport/iamport.service";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly iamportService: IamportService,

    private readonly connection: Connection,
  ) {}

  async findAll() {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // 조회시 락을 걸고 조회함으로써, 다른 쿼리에서 조회 못하게 막음(대기시킴) => Select ~ For Update
      const payment = await queryRunner.manager.find(Payment, {
        lock: { mode: 'pessimistic_write' },
      });
      console.log(payment);

      // 처리에 5초간의 시간이 걸림을 가정!!
      setTimeout(async () => {
        await queryRunner.commitTransaction();
      }, 5000);
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }

  // 지영누나 크리에이트 부분
  // async create({ impUid, amount, productDirectId, productUglyId }) {
  //   const queryRunner = await this.connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction('SERIALIZABLE');

  //   const existingPayment = await this.paymentRepository.findOne({
  //     where: { impUid: impUid },
  //   });

  //   if (existingPayment !== undefined) {
  //     throw new ConflictException("이미 결제 테이블에 추가된 결제건입니다");
  //   }

  //   try {
  //     // 조회를 했을때, 바로 조회되지 않고 락이 풀릴 때 까지 대기
  //     const payment = await queryRunner.manager.find(Payment);
  //     console.log('========== 철수가 시도 ==========');
  //     console.log(payment);
  //     console.log('==============================');
  //     await queryRunner.commitTransaction();

  //     // by 지영
  //     // this.paymentRepository.paymentComplete = true;
      
  //     return payment;
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //   }
  // }

  //승원 크리에이트 부분
  async create({ impUid, amount, currentUser, productDirectId, productUglyId  }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    


    await queryRunner.startTransaction('SERIALIZABLE');
    // const oldpayment = await this.paymentRepository.findOne({
    //   where: { impUid: impUid },
    // });

    // if (oldpayment !== undefined) {
    //   throw new ConflictException('이미 결제가 된 건 입니다.');
    // }
    try{
    const payment = this.paymentRepository.create({
      impUid: impUid,
      user: currentUser,
      amount: amount,
      paymentComplete: PAYMENT_STATUS_ENUM.PAYMENT,
    });
    // await this.paymentRepository.save(payment); //위에 크리에이트를 저장하기 위해 save를 사용 크리에이트 하지 않고 바로 save 사용해도 됨
    await queryRunner.manager.save(payment)

    //==-=-=-==-강제로 에러 발생시키는 기능-=-=-=-=-=-=-=-=
    // throw new Error('강제로 에러 발생!!!');
    //=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=

    // 2. 유저의 돈 찾아오기
    const user = await queryRunner.manager.findOne(
      User,
      { id: currentUser.id },
      { lock: { mode: 'pessimistic_write' } }, //transaction 이 "serializable"일때 사용 가능합니다.
    );
    // 3. 유저의 돈 업데이트
    // await this.userRepository.update(
    //   //업데이트는 크리에이트와 달리 세이브 없이 바로 저장 됨
    //   //첫 중괄호는 조건
    //   { id: user.id },
    //   {
    //     paymentsMade: user.paymentsMade + quantity,
    //     amount: user.amount + amount,
    //   },
    // );
    const updatedUser = this.userRepository.create({
      ...user,
      // amount: user.amount + amount,
    });
    await queryRunner.manager.save(updatedUser);

    await queryRunner.commitTransaction();

    // 4. 최종결과 프론트엔드에 돌려주기
    return payment;
    } catch (error) {
      // ====================== rollback 되돌리기!!! =================
      await queryRunner.rollbackTransaction();
      // ===========================================================
    } finally {
      // ====================== 연결 해제!!! =================
      await queryRunner.release();
      // ===================================================
    }
  }

}
