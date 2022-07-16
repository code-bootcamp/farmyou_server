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

    // 기본주소 (도로명 주소)
    @Column()
    @Field(() => String)
    address: string;

    // 상세주소
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    detailedAddress: string;

    // 우편번호
    @Column()
    @Field(() => String)
    postalCode: string;

    @Column({ default: false })
    @Field(() => Boolean)
    isMain: boolean;

    // 회원
    @ManyToOne(() => User)
    @Field(() => User, {nullable: true})
    user: User;
}
