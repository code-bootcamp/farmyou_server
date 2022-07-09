import { Injectable, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
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

  async create({ impUid, amount, productDirectId, productUglyId }) {
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    const existingPayment = await this.paymentRepository.findOne({
      where: { impUid: impUid },
    });

    if (existingPayment !== undefined) {
      throw new ConflictException("이미 결제 테이블에 추가된 결제건입니다");
    }

    try {
      // 조회를 했을때, 바로 조회되지 않고 락이 풀릴 때 까지 대기
      const payment = await queryRunner.manager.find(Payment);
      console.log('========== 철수가 시도 ==========');
      console.log(payment);
      console.log('==============================');
      await queryRunner.commitTransaction();

      // by 지영
      // this.paymentRepository.paymentComplete = true;
      
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }
}
