import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
// import { User } from 'src/apis/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
@ObjectType()
@InputType()
export class DirectStore {
  // 직매장ID
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 매장명
  @Column()
  @Field(() => String)
  name: string;

  // 직매장주소
  @Column()
  @Field(() => String)
  address: string;
}