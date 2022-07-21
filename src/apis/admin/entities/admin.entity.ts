import { Field, FIELD_TYPENAME, ObjectType } from '@nestjs/graphql';
import { DirectStore } from 'src/apis/directStore/entities/directStore.entity';
import { File } from 'src/apis/file/entities/file.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
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

    @Column({nullable: true, default: null})
    @Field(() => String, {nullable: true})
    phone: string;

    // 이메일
    @Column()
    @Field(() => String)
    email: string;

    // 비밀번호
    @Column()
    // @Field(() => String) 비밀번호 노출 금지!!
    password: string;

    // 좋아유
    @Column({nullable: true, default: -1})
    @Field(() => Number)
    like: number;

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

    // 이미지 url
    @OneToMany(() => File, (file) => file.admin)
    @Field((type) => [File], {nullable: true})
    files: File[];
}
