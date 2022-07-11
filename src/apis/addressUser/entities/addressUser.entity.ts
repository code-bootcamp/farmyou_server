import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
@ObjectType()
export class AddressUser {
  // 주소ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({default: false})
  @Field(() => Boolean)
  isMain: boolean;

  // 주소 (도로명 주소)
  @Column()
  @Field(() => String)
  address: string;

  // 상세주소
  @Column()
  @Field(() => String)
  detailedAddress: string;

  // 우편번호
  @Column()
  @Field(() => String)
  postalCode: string;

  // 회원
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
