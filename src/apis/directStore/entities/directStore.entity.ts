import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Admin } from 'src/apis/admin/entities/admin.entity';
// import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
@ObjectType()
// @InputType()
export class DirectStore {
  // 직매장ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 매장명
  @Column()
  @Field(() => String)
  name: string;

  @JoinColumn()
  @OneToOne(() => Admin)
  @Field(() => Admin)
  admin: Admin;

  // 직매장주소 -- 필요없음
  // @Column()
  // @Field(() => String)
  // address: string;
}