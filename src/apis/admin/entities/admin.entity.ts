import { Field, FIELD_TYPENAME, ObjectType } from '@nestjs/graphql';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Admin {
    // 회원ID
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column({nullable: true, default: null})
    @Field(() => String, {nullable: true})
    name: string;

    // 이메일
    @Column()
    @Field(() => String)
    email: string;

    // 비밀번호
    @Column()
    // @Field(() => String) 비밀번호 노출 금지!!
    password: string;

    // 계정타입
    @Column({ default: 'admin' })
    @Field(() => String)
    type: string;

    // 등록날짜
    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

    @JoinColumn()
    @OneToOne(() => DirectStore)
    @Field(() => DirectStore, {nullable: true})
    directStore?: DirectStore;
}
